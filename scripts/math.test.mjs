import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import {publicationFiles,root} from './validate-delivery.mjs';

const parser=new MarkdownIt().use(texmath,{engine:katex,delimiters:['gitlab','dollars']});

function inspectMath(text){
  const expressions=[],errors=[];
  if(/\r(?!\n)|[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text))errors.push('Unexpected source control character');
  function visit(tokens,parentLine=1){
    for(const token of tokens){
      const line=token.map?token.map[0]+1:parentLine;
      if(token.type.startsWith('math_')){
        const tex=token.content;
        const expression={line,tex,display:token.block||token.type.includes('double')};
        expressions.push(expression);
        if(/\\operatorname\b/.test(tex))errors.push(`${line}: GitHub rejects the operatorname macro`);
        if(/[\x00-\x09\x0B-\x1F]/.test(tex))errors.push(`${line}: Control character or tab in formula`);
        try{
          // Unicode prose in text commands is intentional; unknown TeX commands still throw.
          const rendered=katex.renderToString(tex,{displayMode:expression.display,throwOnError:true,strict:'ignore',trust:false});
          assert.ok(rendered.includes('class="katex"'),'Formula did not produce rendered math');
        }catch(error){
          if(!(error instanceof katex.ParseError))throw error;
          errors.push(`${line}: ${error.message}`);
        }
      }
      if(token.children)visit(token.children,line);
    }
  }
  visit(parser.parse(text,{}));
  return {expressions,errors};
}

test('math parsing covers GitHub delimiters without treating code or currency as formulas',()=>{
  const source=[
    String.raw`Inline $x+\mathrm{Select}(y)$ and $`+'`z+1`$.',
    '$$',
    String.raw`\frac{a}{b}`,
    '$$',
    '```math',
    String.raw`\theta^\star`,
    '```',
    '`$\\operatorname{Code}(x)$`',
    '```js',
    'const example = "$\\operatorname{Code}(x)$";',
    '```',
    'Prices: $20.00 and $30.00.',
  ].join('\n');
  const result=inspectMath(source);
  assert.deepEqual(result.errors,[]);
  assert.equal(result.expressions.length,4);
  assert.equal(result.expressions.filter(expression=>expression.display).length,2);
  assert.ok(result.expressions.some(expression=>expression.tex==='z+1'));
});

test('math checks reject the reported macro, lost escapes and invalid TeX',()=>{
  const cases=[
    [String.raw`$\operatorname{Run}(S)$`,/operatorname/],
    ['$$\n\theta = x\n$$',/Control character/],
    [String.raw`$S^\*$`,/Undefined control sequence/],
    [String.raw`$\frac{a}{b$`,/expected.*\}/i],
    [String.raw`$\notARealCommand{x}$`,/Undefined control sequence/],
    ['$$\n\\theta = x\rho\n$$',/source control character/],
  ];
  for(const [source,expected]of cases)assert.match(inspectMath(source).errors.join('\n'),expected,source);
});

test('every public Markdown formula renders and obeys GitHub macro restrictions',t=>{
  const findings=[];
  let filesWithMath=0,expressions=0,display=0;
  for(const file of publicationFiles().filter(file=>file.endsWith('.md'))){
    const result=inspectMath(fs.readFileSync(file,'utf8'));
    if(result.expressions.length)filesWithMath++;
    expressions+=result.expressions.length;
    display+=result.expressions.filter(expression=>expression.display).length;
    findings.push(...result.errors.map(error=>`${path.relative(root,file)}:${error}`));
  }
  assert.deepEqual(findings,[],findings.join('\n'));
  assert.ok(expressions>=400,'Formula coverage unexpectedly regressed');
  assert.ok(display>=49,'Display-formula coverage unexpectedly regressed');
  t.diagnostic(JSON.stringify({files_with_math:filesWithMath,formulas_rendered:expressions,display_formulas:display}));
});

test('SEAL adaptation keeps its theta parameter and paired meta-evaluation keeps valid stars',()=>{
  const training=fs.readFileSync(path.join(root,'docs/zh/chapters/02_Training_Environments_and_AI_Research.md'),'utf8');
  assert.ok(inspectMath(training).expressions.some(expression=>expression.tex.includes(String.raw`\theta'(e)=\mathrm{SFT}(\theta,e)`)));
  const handbook=fs.readFileSync(path.join(root,'docs/zh/04_Algorithm_Handbook.md'),'utf8');
  assert.ok(inspectMath(handbook).expressions.some(expression=>expression.tex.includes(String.raw`Q(I_1(S^\star;B))`)));
});

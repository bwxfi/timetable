const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();const element=()=>({textContent:'',innerHTML:'',classList:{toggle(){}},dataset:{}});const document={querySelector:s=>{if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll:()=>[],addEventListener(){}};const context=vm.createContext({document,localStorage:{getItem(){return null},setItem(){}},navigator:{},structuredClone,console,Date,crypto:require('node:crypto').webcrypto});vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
let count=0;function test(code){vm.runInContext(code,context);count++}
context.assert=assert;
test("assert.equal(state.courses.length,0)");
test("assert.equal(commit({courses:[{id:'a',name:'数据结构',room:'A101',day:0,start:'08:00',end:'09:40',total:32,done:0}],tasks:[]}),true)");
test("mutate(s=>s.tasks.push({id:'t',course:'a',title:'实验',due:'2026-11-02',done:false}));assert.equal(state.tasks.length,1)");
test("mutate(s=>s.tasks[0].done=true);assert.equal(state.tasks[0].done,true)");
test("assert.throws(()=>validate({courses:[],tasks:state.tasks}))");
test("assert.throws(()=>validate({courses:[{...state.courses[0],done:33}],tasks:[]}))");
test("assert.throws(()=>validate({courses:[{...state.courses[0],end:'07:00'}],tasks:[]}))");
test("assert.throws(()=>validate({courses:[state.courses[0],state.courses[0]],tasks:[]}))");
test("assert.equal(esc('<script>'), '&lt;script&gt;')");
test("for(const v of ['overview','schedule','tasks','courses']){view=v;render();assert.ok(document.querySelector('#content').innerHTML.length>0)}");
test("localStorage.setItem=()=>{throw Error('quota')};assert.equal(commit({courses:[],tasks:[]}),false);assert.equal(state.courses.length,1)");
console.log(`${count} tests passed`);

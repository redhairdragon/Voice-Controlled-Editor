import { Component, OnInit,OnDestroy } from '@angular/core';
import {VoiceCommandService} from '../voice-command.service'

const WordToInt={
  "two":2,
  "three":3,
  "four":4,
  "five":5,
  "six":6,
  "seven":7,
  "eight":8,
  "nine":9
}
//add voice activation into library
//select words/sentence
//ppt

// search highlit(ritam)
//demonstration api<->ui
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit,OnDestroy {
  bold:boolean=false;
  editor;
  speech:string;
  error:string;
  default_format;
  showButton: boolean;
  speechData: string;
  keyBoardData;
  recording:boolean;
  copyBuffer:string;

  constructor(private vcs: VoiceCommandService) {
    this.showButton = true;
    this.speechData = "";
    this.vcs.bindActivationKey(16);
    this.vcs.registerOnEndFunction((str)=>{
      this.vcs.handleCommand(str);
    })
  }

  setUpEditor(e){
    this.editor=e;
    this.default_format=this.editor.getFormat();
    this.vcs.addCommand("copy",()=>{
                        var range=this.editor.getSelection();
                        this.copyBuffer=this.editor.getText(range.index, range.length);
                        console.log(this.copyBuffer)});
    this.vcs.addCommand("paste",()=>{
                        var {index,length}=this.editor.getSelection();
                        this.delete_text();
                        this.editor.insertText(index,this.copyBuffer+" ",this.editor.getFormat(),"api") 
                        })
    this.vcs.addCommand("make text @format",
                       (style)=>{this.editor.format(style,true,"api")},
                       "@format");
    this.vcs.addCommand("make size @size",
                       (size)=>{this.editor.format("size",size,"api")},
                       "@size");
    this.vcs.addCommand("make heading @size",
                       (size)=>{this.editor.format("header",size,"api")},
                       "@size");

    this.vcs.addCommand("align to the @pos",(pos)=>{this.editor.format("align",pos,"api")},"@pos")
    this.vcs.addCommand("remove format",()=>this.editor.removeFormat(this.editor.getLength()-2,1))
    this.vcs.addCommand("next line",()=>{this.remove_selection();
                                          this.setCursorNextLine()})
    this.vcs.addCommand("next @num lines",(num)=>{
      if(num in WordToInt)
        num=WordToInt[num]
      this.remove_selection();
      for(let i=0;i<num;i++)
        this.setCursorNextLine()},"@num")
    this.vcs.addCommand("delete text",()=>{this.delete_text()})

    this.vcs.addCommand("previous paragraph",()=>{
      this.remove_selection();
      this.previous_paragraph(1,false)
    })
    this.vcs.addCommand("previous @num paragraphs",(num)=>{
      num=WordToInt[num]
      this.remove_selection();
      this.previous_paragraph(num,false)
    },"@num")

    this.vcs.addCommand("select previous paragraph",()=>{
      this.previous_paragraph(1,true)
    })
    this.vcs.addCommand("select previous @num paragraphs",(num)=>{
      num=WordToInt[num]
      this.previous_paragraph(num,true)
    },"@num")

    this.vcs.addCommand("select last paragraph",()=>{
      this.previous_paragraph(1,true)
    })
    this.vcs.addCommand("select last @num paragraphs",(num)=>{
      num=WordToInt[num]
      this.previous_paragraph(num,true)
    },"@num")

    this.vcs.addCommand("select next paragraph",()=>{
      this.next_paragraph(1,true)
    })
    this.vcs.addCommand("select next @num paragraphs",(num)=>{
      num=WordToInt[num]
      this.next_paragraph(num,true)
    },"@num")

    this.vcs.addCommand("next paragraph",()=>{
      this.remove_selection();
      this.next_paragraph(1,false)
    })
    this.vcs.addCommand("next @num paragraphs",(num)=>{
      num=WordToInt[num]
      this.remove_selection();
      this.next_paragraph(num,false)
    },"@num")

  }

  delete_text(){
    var e=this.editor;
    var sel=e.getSelection();
    e.deleteText(sel.index,sel.length,"api")
  }

  remove_selection(){
    let range=this.editor.getSelection()
    if(range.length!==0){
      this.editor.setSelection(range.index+range.length,0,"api");
    }
  }

  next_paragraph(num:number,selection:boolean){
    var content=this.editor.getText(0);
    var range = this.editor.getSelection();
    var start=range.index;
    let next_return=function(current_index){
      for(var i=current_index;i<content.length;i++){
        if(content[i]==='\n')
          return i;
      }
      return i;
    } 
    let next_non_return=function(current_index){
      for(var i=current_index;i<content.length;i++){
        if(content[i]!=='\n')
          return i;
      }
      return i;
    }
    if(start==0||content[start-1]==='\n'){}
    else{
      start=next_return(start);
      start=next_non_return(start);
    } 
     
    let end=start,inter_end=start;
    for(let i=0;i<num;i++){
      inter_end=next_return(inter_end);
      if(i===num-1)
        break; 
      inter_end=next_non_return(inter_end);
    }
    end=inter_end;
    let len=0;
    if (selection===true)
      len=end-start
    this.editor.setSelection(start,len,'api')
  }

  previous_paragraph(num:number,selection:boolean){
    var content=this.editor.getText(0);
    var range = this.editor.getSelection();
    var end=range.index;
    var start=0;
    let last_return=function(current_index){
      if(current_index===-1) return -1
      for(let i=current_index;i>=0;i--){
        if(content[i]==='\n')
          return i;
        if(i===0)
          return -1;
      }
    } 
    let last_non_return=function(current_index){
      if(current_index===-1) return -1
      for(let i=current_index;i>=0;i--){
        if(content[i]!=='\n')
          return i;
        if(i===0)
          return -1;
      }
    }
    let x=last_non_return(end);
    if(x===end){
      end=last_return(x);
      end=last_non_return(end);
    }
    else
      end=x;

    let inter_end=end
    for(let i=0;i<num;i++){
      inter_end=last_non_return(inter_end);
      inter_end=last_return(inter_end);  
    }
    start=inter_end

    let len=end-start+1;
    if((end==-1 && start==-1)||(selection===false))
      len=0
    this.editor.setSelection(start+1,len,'api')
  }


  setCursorNextLine():void{
    var e=this.editor;
    var {index,length}=this.editor.getSelection(true);
    if(length===0){
    let remain_content=this.editor.getText(index);
    var count=0;
    for(let i=0;i<remain_content.length-1;i++){
      if(remain_content[i]=='\n')
        break;
      count++;
    }
    if(index+count+1>=e.getLength()){
      e.insertText(this.editor.getLength()-1,"\n",e.getFormat(),"api")
      e.setSelection(this.editor.getLength()-1,0,"api");
    }
    else  
      e.setSelection(index+count+1,0,"api");
    }
  }

  setCursorPreviousLine(){
    var e=this.editor;
    var {index,length}=this.editor.getSelection(true);
    if(length===0){
      let prev_content=this.editor.getText(0,index);
      var count=0;
      for(let i=prev_content.length-1;i>=0;i--){
        if(prev_content[i]=='\n'){
          count++;
          break;
        }
        count++;
      }
      e.setSelection(index-count,0,"api");
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.vcs.DestroySpeechObject();
  }
}


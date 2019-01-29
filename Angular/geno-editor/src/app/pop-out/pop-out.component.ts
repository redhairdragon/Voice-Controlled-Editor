import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import {VoiceCommandService} from '../voice-command.service'

@Component({
  selector: 'app-pop-out',
  templateUrl: './pop-out.component.html',
  styleUrls: ['./pop-out.component.css']
})
export class PopOutComponent implements OnInit {
	mainDisplay:string;
	redDotStyle;
	popDivStyle;
	popDivVisible;

	
	constructor(private vcs: VoiceCommandService,private cdr: ChangeDetectorRef) {
		this.redDotStyle={};
		this.popDivStyle={};
		this.popDivVisible=false;

		this.updateDisplay("Listening...");
		this.vcs.registerOnStartFunction(()=>{
			this.setBorderColor("#ee9090");
			this.showPopOut();
			this.toggleMicAnimation();
			this.cdr.detectChanges();
		});
		this.vcs.registerOnEndFunction((str)=>{
			if(str!==""){
				this.setBorderColor("#90eebf");
				this.hidePopOut(1500)
			}
			else 
				this.hidePopOut(1)
			this.toggleMicAnimation();
			this.cdr.detectChanges();
		});
		this.vcs.registerOnResultFunction((str)=>{
			this.updateDisplay(str);
			this.setBorderColor("#90bfee");
			this.cdr.detectChanges();
		});
	}
 	updateDisplay(str){
		this.mainDisplay=str;
	}
	toggleMicAnimation(){
		if (this.redDotStyle.display==="block") 
			this.redDotStyle.display="none";
		else
			this.redDotStyle.display="block";
	}
	setBorderColor(color){
		this.popDivStyle.borderColor=color;
	}
	showPopOut(){
		this.popDivVisible=true;
	}
	hidePopOut(timeout=0){
		window.setTimeout(()=>{
			this.popDivVisible=false;
			this.updateDisplay("Listening...")
			this.cdr.detectChanges();
		},timeout)
	}
	getRedDotStyle(){
		return this.redDotStyle;
	}
	getPopDivStyle(){
		return this.popDivStyle;
	}
	getPopDivVisible(){
		return this.popDivVisible;
	}
	ngOnInit() {
	}

}

import { Injectable } from '@angular/core';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}


@Injectable({
  providedIn: 'root'
})
export class VoiceCommandService {

	fnListOnStart;
	fnListOnResult;
	fnListOnEnd;
	keyList;
	keyEventFunction;

	//
	speechRecognition;
	mappingList;
	continous:boolean;
	term;
	defauntFn;

	//
	constructor(){
		//initialize some member variables
		this.term="";
		this.fnListOnStart=[];
		this.fnListOnResult=[];
		this.fnListOnEnd=[];
		this.keyList=[];
		this.keyEventFunction;


		this.defauntFn=null;
		this.mappingList={}
		const { webkitSpeechRecognition }: IWindow = <IWindow>window;
		this.speechRecognition = new webkitSpeechRecognition();
		this.speechRecognition.continuous = true;
		this.speechRecognition.lang = 'en-us';
		this.speechRecognition.maxAlternatives = 1;
		this.speechRecognition.interimResults = true;

		//set on result
   		this.speechRecognition.onresult = speech => {
			if (speech.results) {
				var result = speech.results[speech.resultIndex];
				var transcript = result[0].transcript;
				if (result.isFinal) {
					console.log(result[0].confidence)
					if (result[0].confidence < 0.5)
						console.log("Unrecognized Speech");
					else {
						this.term+=transcript;
						console.log("Heard: " + this.term);
					}
					for(let i=0;i<this.fnListOnResult.length;i++){
						this.fnListOnResult[i](this.term);
					}
				}
			}
		};
		//set on start
   		this.speechRecognition.onstart = ()=>{
   			for(let i=0;i<this.fnListOnStart.length;i++){
				this.fnListOnStart[i]();
			}
   		}
		//set onEnd
		this.speechRecognition.onend=()=>{
			for(let i=0;i<this.fnListOnEnd.length;i++){
				this.fnListOnEnd[i](this.term);
			}
			this.term="";
		}

		//add key Event Listener
   		window.addEventListener("keydown",(e)=>{
			if(this.keyList.find((key)=>{return key===e.keyCode})!==undefined){
				this.startRecord();
			}
		})
		window.addEventListener("keyup",(e)=>{
			if(this.keyList.find((key)=>{return key===e.keyCode})!==undefined){
				this.stopRecord();
			}
		})
	}


	registerOnStartFunction(fn){
		if(typeof fn==="function")
			this.fnListOnStart.push(fn)	
		else
			console.log("Not a valid function")
	}
	//register function which will be called when there is result(either intermediate/final)
	//example usage: registerOnResultFunction((speech)=>{...})
	registerOnResultFunction(fn){
		if(typeof fn==="function")
			this.fnListOnResult.push(fn)	
		else
			console.log("Not a valid function")
	}

	registerOnEndFunction(fn){
		if(typeof fn==="function"){
			this.fnListOnEnd.push(fn)	
		}
		else
			console.log("Not a valid function")
	}

	//update Element content when stop recording
	//example usage: bindElement(document.getElementById("example"))
	bindElement(element){
		if(element){
			this.registerOnResultFunction((speech)=>{element.innerHTML=speech});
		}
	}

	//bind one key with Start and Stop of the speech recognizer (add to the key list)
	bindActivationKey(keyCode){
		this.keyList.push(keyCode);
	}

	startRecord(){
		console.log("Start Recording")
		this.term="";
		this.speechRecognition.start();
	}

	stopRecord(){
		this.speechRecognition.stop();
		console.log("Stop Recording")
	};

	addCommand(str,fn,...args){
		let words=str.replace(/[^\w|@|\s]/g,"").split(" ").filter((s)=>s!=="")
		let function_part=[fn];
		for(let i=2;i<arguments.length;i++){
			function_part.push(arguments[i])
		}
		this.mappingList[words.join(" ")]=function_part;
	}
	setDefaultFn(fn){
		this.defauntFn=fn;
	}

	handleCommand(sentence){
		let processMappingStr=function(mappingStr){
			let words=mappingStr.split(" ");
			let params=[]
			for(let i=0;i<words.length;i++){
				if (words[i][0]==='@'){
					params.push(words[i])
					words[i]='(\\w+)'
				}
			}
			let reg="^"+words.join(" ")+"$";
			let match_res=(new RegExp(reg)).exec(sentence)
			// console.log(match_res)
			if (match_res===null) return null;
			else{
				var res={};
				let len=params.length;
				for(let i=0;i<len;i++)
					res[params.shift()]=match_res[1+i]

				return res;
			}
		}
		for(var key in this.mappingList){
			var mapRes=processMappingStr(key)
			if(mapRes!==null){
				var args=[]
				let len=this.mappingList[key].length
				for(let i=1;i<len;i++){
					let x=this.mappingList[key][i][0];
					if(typeof x==='string'&& x[0]==='@')
						args.push(mapRes[this.mappingList[key][i]])
					else
						args.push(this.mappingList[key][i])
				}
				console.log(args)
				this.mappingList[key][0](...args)
				return;
			}
		}
		if(this.defauntFn!==null)
			this.defauntFn(sentence);
	}

	DestroySpeechObject(){
        if (this.speechRecognition)
            this.speechRecognition.abort();
    }
}


// record(){
	// 	this.speechRecognition.abort();
	// 	return new Promise((resolved,rejected)=>{
	// 		this.speechRecognition.onresult = speech => {
	// 			this.term="";
	// 			if (speech.results) {
	// 			    var result = speech.results[speech.resultIndex];
	// 			    var transcript = result[0].transcript;
	// 			    if (result.isFinal) {
	// 			        if (result[0].confidence < 0.3)
	// 			            console.log("Unrecognized Speech");
	// 			        else {
	// 			            this.term=transcript.trim();
	// 			            console.log("Heard: " + this.term);
	// 			        }
	// 			    }
	// 			}
	// 		};
	// 		this.speechRecognition.onerror = error => {
	// 			if(error.error!=="no-speech"){
	// 				this.speechRecognition.abort();
	// 				this.term="";
	// 				rejected(error)
	// 			}
	// 			else{
	// 				this.term=undefined
	// 				console.log("No speech")
	// 			}
	// 		};
	// 		this.speechRecognition.onend = () => {
	// 			if(this.term===undefined)
	// 				this.term=""
	// 			resolved(this.term);
	// 			console.log("FINISHED")
	// 		};
	// 		this.speechRecognition.start();
	// 		console.log("START LISTENING");
	// 	});
	// };

	
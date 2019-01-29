----

# Shen's Note on Project Geno

Adding voice(but not limited) modality to the exisiting website. 

Require developers to write as less code as possible.

##  Things to Do

### 0. Brainstorming 

Survey on how developers would like to add voice modality

Possible Tasks can be done:

- Media Control(Pause/Play)

* Ordering Merchandise
* Browsing News
* Creating Calendars
* ...  Check the mega notes https://docs.google.com/document/d/1GjqN2jiYbONElUoiq3YMdOEJEswS4Yz6GEAsS58i8YY/edit?usp=sharing

### 1. Basic Funtionalities

#### Text Highlighting and Search

Goal: Help users to identify the elements by using keyword searching (within the viewport?). This can also be followed by clicking, copying content or link address, inputting value...

#### Scroll 

Goal: scroll into different directions/elements by a value(20%/Value which can be set by developer)

#### Input Forms

Goal: locate the input box and use voice to input content. 

#### Showing command on the page 

Goal: show the command which is currently recorded on webpage. Hided(sec delay) it when it finishes. 

![1](/Users/cocoastarrion/Desktop/GENO NOTE/image/4.gif)

---



### 2. Voice to Function Mapping

##### Task Goal:

The function we provide can **Extract Parameters** inside the voice sentences, and **Mapping Similar Commands into Designated Function Provided by Developer**.

##### Current Solution:

Using addCommand(str,fn,params...) to add str into the dictionary. 

And when handleCommand(str) is called, the system will find and invoke the matching function.

Functions:

**addCommand(CommandStr,CallbackFn,parameters...)**

CommandStr: string which contains parameters starting with "@"

CallbackFn: function which will be invoked when handleCommand finds the matching command

parameters: strs that appear in the CommandStr. These are needed for getting order.

e.g.

![image-20181114235205065](/Users/cocoastarrion/Desktop/GENO NOTE/image/1.png)

**handleCommand(str)**

str: voice from the user

e.g.

![image-20181115000931552](/Users/cocoastarrion/Desktop/GENO NOTE/image/2.png)

This will extract **bold** as parameter and invoke *(style)=>{this.editor.format(style,true,"api")}* with *style="bold"*

A more complicated example:

![image-20181115001629807](/Users/cocoastarrion/Desktop/GENO NOTE/image/3.png)

---



#### Richtext Editor Demo(Angular)

Goal: Be able to use voice to control editor while the user is typing.

Demo: https://redhairdragon.github.io/geno/ 

Code: https://github.com/redhairdragon/geno



##### Problems:

1. The text processing is not sophisticated enough. 

   For example *select previous three paragraphs*  which is similar to *select last three paragraphs*. In this case the developer has to add similar commands twice. Also sometimes the google voice recognition API or the user self misses the 's' in the *paragraphs*. 

2. Still too many coding required for developers

   Can it be solved by Programming by Demonstration??

#### Furture Improvement 

Integrate NLP to replace the current implementation.

### 3. Programming By Demonstration (Still thinking)

#### Goal:

Similar to SUGILITE: https://www.youtube.com/watch?v=KMx7Ea6W6AQ

Developers can relate a series of operations with voice command.

Without modifying the current website, developers can add a script and generate code in a js file in a similar fashion like CSS.

![image-20181115004612727](/Users/cocoastarrion/Library/Application Support/typora-user-images/image-20181115004612727.png)

![image-20181115004628768](/Users/cocoastarrion/Library/Application Support/typora-user-images/image-20181115004628768.png)

Steps:

1. Developers start to talk or just input a sentence.
2. Extract the parameters inside the sentence.
3. Perform the Demo.
4. End with some indicator.
5. Generalize the demonstration.
6. Repeat 1-4.
7. Generate a file which can be added into the website.

#### Good thing

Probably don't have to write a lot of code.

#### Bad thing 

May not be able to capture or generalize complex actions ??

#### Some Details

1. Does it work on consecutive pages(with redirection?)

   Single Page Application may be ideal. Is it possible to save the progress in the local storage and load it when page refreshes or redirect to another address?

2. How to generalize the demonstration?

   how to relate the parameters with the generaliztion?

   e.g. I want to order a cup of *green tea frappucino*.

   do a partial matching with the html element content...

   Html structure/content/element attribution.

3. Which evenets to monitor?

   Click, keyboard input, hover, select...


Weird graph(probably ignore it)

![image-20181115005645489](/Users/cocoastarrion/Desktop/GENO NOTE/image/5.png)

### 4. Build an IDE
















let len =document.querySelectorAll("#tagline path");

for(let i=0;i<len.length;i++){
    console.log(i,len[i].getTotalLength());
}
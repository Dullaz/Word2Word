export const Shuffle = (text: string, locked: number[]) => {

    var a = text.split("");
    locked.forEach((l) => {
        a.splice(l, 1)
    });
    var n = a.length;
  
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    locked.forEach((l) => {
        a.splice(l,0,text.charAt(l))
    })

    return a.join("")
  }
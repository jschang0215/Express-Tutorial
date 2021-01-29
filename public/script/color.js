var Body = {
    setBodyColor: function setBodyColor(color) {
        document.querySelector('body').style.color = color;
    },
    setBodyBackgroundColor: function setBodyColor(color) {
        document.querySelector('body').style.backgroundColor = color;
    }
};

var Link = {
    setLinkColor: function setLinkColor(color) {
        $('a').css("color", color);
    }
};

function nightDayHandler(self) {
    if(self.value==='Night') {
        Body.setBodyBackgroundColor('black');
        Body.setBodyColor('white');
        Link.setLinkColor('white');
        document.getElementById('night_day').value = 'Day';
    } else {
        Body.setBodyBackgroundColor('white');
        Body.setBodyColor('black');
        Link.setLinkColor('black')
        document.getElementById('night_day').value = 'Night';
    }
}
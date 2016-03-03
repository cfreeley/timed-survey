var querystring = window.location.search.substring(1);

var typewriter = querystring.indexOf("tw") >= 0;
var fontcolor = querystring.indexOf("fnt") >= 0;
var current = 0;
var answers = [-1,-1,-1];
var states = 
        [
            {
                number:1,
                unit: "cents",
                question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"
            },
            {
                number:2,
                unit: "minutes",
                question: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?"
            },
            {
                number:3,
                unit: "days",
                question: "In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?"
            }
        ];

$(function() {
    ready();
})

var ready = function() {
    var source   = $("#survey").html();
    var template = Handlebars.compile(source);
    $("#target").html(template(states[current]));
    if (typewriter) {
        var speed = 300;
        var speedRe = /\d+/;
        if (querystring.match(speedRe) != null)
            speed = parseInt(querystring.match(speedRe)[0]);
        var question = questionBlock.init(states[current].question);
        var func = function() {
            states[current].question = question.getHTML();
            $("#target").html(template(states[current]));
            $("#nextButton").css('visibility', 'hidden');
            if (question.showNext())
                window.setTimeout(func, speed);
            else
                $("#nextButton").css('visibility', 'visible');
        };
        func();
    }
}

var questionBlock = 
{
    firstHalf: "",
    secondHalf: "",
    init: function(str) 
    {
        this.firstHalf = "";
        this.secondHalf = str;
        return this;
    },
    getHTML: function() {
        return "<span style='visibility:visible'>" + 
        this.firstHalf + "</span><span style='visibility:hidden'>" +
        this.secondHalf + "</span>";
    },
    showNext: function() {
        var re = /\S+\s?/;
        var search = this.secondHalf.match(re);
        if (search == null) {
            return false;
        }
        this.firstHalf += search[0];
        this.secondHalf = this.secondHalf.replace(re,"");
        return true;
    }
}

var finish = function() {
    var source   = $("#finish").html();
    var template = Handlebars.compile(source);
    $("#target").html(template);

}

var next = function() {
    var ans = $("#answer").val();
    if (isNaN(ans))
    {
        alert("Please enter a valid number.");
        return;
    }
    answers[current] = ans;
    current += 1;
    if (current < 3)
        ready();
    else
        finish();
}
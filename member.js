function skillsMember(){    
    var skills = document.getElementById("skills");
    var skillsList = skills.getElementsByTagName("li");
    for (var i = 0; i < skillsList.length; i++) {
        var skill = skillsList[i];
        skill.addEventListener("click", function() {
            this.classList.toggle("active");
        });
    }            
}
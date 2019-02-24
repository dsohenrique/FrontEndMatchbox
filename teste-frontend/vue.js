Vue.component('ranking-list', {
      template: 
      	"<div id='container'>\
		  <div class='ranking-list'>\
		    <ul id='list'>\
		      <li v-for='(user , index) in users' @mouseover='showRating(user.positive, user.negative, user.__id, user.message)' class='tooltip'>\
		 		<span class='tooltiptext'>\
		 		<table class='table'>\
					 <tr class='table-head'>\
					 <th>Gostam</th>\
					 <th>Não Gostam</th>\
					 </tr>\
					 <tr class='table-body'>\
					 <td :id='user.__id'></td>\
					 <td :id='user.negative'></td>\
					 </tr>\
					</table>\
		 		</span>\
			    <img class='avatar' :src='user.picture'/>\
			    <div class='rank-position'>{{index+1}}</div>\
			    <span class='user-info'>\
			    	<p id='user-name'>{{user.name}}</p>\
			    	<p id='user-description'>{{user.description}}</p>\
			    </span>\
		      </li>\
		    </ul>\
		  </div>\
		</div>\
      	",
      props:['users']
	})                            
function calculaterating(positive, negative) {
	if (positive == null || negative == null) {
	 throw 'Valor Não Informado :(';
	}
	var total = parseInt(positive) + parseInt(negative);
	var positivePercentage = (positive / total ) * 100;
	var negativePercentage = (negative / total ) * 100;
	return new Array (positivePercentage.toFixed(0), negativePercentage.toFixed(0));
}
function showRating(positive, negative, id, message){
	if (message !== undefined) {
		document.getElementById(id).innerHTML = message;
		document.getElementById(id).setAttribute("colspan", "2"); 
		document.getElementById(id).setAttribute("style", "font-size:x-small"); 
	}
	else{
	document.getElementById(id).innerHTML = positive;
	document.getElementById(negative).innerHTML = negative;
	}
}
function compareUsers(a, b) {
    if (a.positivePercentage < b.positivePercentage)
		return 1;
    if (a.positivePercentage > b.positivePercentage){
      	return -1;
      }
        return 0;
}
new Vue({
	el: "#root",
    data: {
    active : true,
    users :[], 
  	},
  	components :{},
  	mounted () {
    	$.getJSON('https://raw.githubusercontent.com/Matchbox-Brasil/frontend-test/master/matchboxbrasil.json', json => {
         	this.users = json.data;
			for (var i = this.users.length - 1; i >= 0; i--) {
	          try{
				var percentages = calculaterating(this.users[i].positive, this.users[i].negative);
				this.users[i].positivePercentage = percentages[0];
				this.users[i].positive = percentages[0] + '%';
				this.users[i].negative = percentages[1] + '%'				
			}
			 catch(error){
			 	this.users[i].positivePercentage = -1;
			 	this.users[i].message = error;
			 }
          }
          this.users = this.users.sort(compareUsers);
          console.log(json.data)
        })
      }
    })
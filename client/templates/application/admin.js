// Template.admin.events({
//     'submit form': function (event) {
 
//         event.preventDefault();
 
//         var username = event.target.username.value;
//         var password = event.target.password.value;
  
//         Accounts.createUser({username:username,password:password},function(err){
//             if(!err) {
//                 console.log("User "+username+" created");
//                 //history.back();  
//             }
//             else {
//                 console.log(err);
//             }
//         });
//     },
//     'click .register--button-submit': function(e) {
//         e.preventDefault();
//         $('#register--form').submit();
//     },        
//     'click .register--button-cancel': function(e) {
//         e.preventDefault();
//         history.back();  
//     }
// });
Template.admin.helpers({
  user: function(){
      return Meteor.users.find({},{sort: {createdAt: -1}});
  }
});


    Template.admin.events({
     'submit form':function(event){

                event.preventDefault();
 
        var username = event.target.username.value;
        var password = event.target.password.value;
        
       Meteor.call('createUserFromAdmin',password,username,function(err,result){
          if(!err){
             console.log("a new user just got created")
            }else{
              console.log("something goes wrong with the following error message " +err.reason )
            }
         })
       }
    })
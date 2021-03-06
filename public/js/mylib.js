

$(document).ready(function(){
$('#hire_date input').datepicker({
    format: 'yyyy-mm-dd'
});
var pusher = new Pusher('dcc9e263026ffd989e0b', {
    cluster: 'ap2',
    forceTLS: true
    });

var channel = pusher.subscribe('channel-test');
channel.bind('event-test', function(data) {
   bootbox.alert(data.msg);
    });
var page=0;
var start=0;
paginationDiv=$('#pagination');
dataDiv=$('#data');
var loadmore='<a class="btn btn-primary" id="loadMore">Load More</a>'
$.ajax({
    url:'/api/all/'+start,
    method:"get",
    success:function(res){
            if(res.rows == undefined){
                res.rows=[];
            }
            if(page == 0){
                start=res.itemsPerPage + 10;
                var data='';
                    data='<div class="row">';
                res.rows.forEach(function(i){
                    data +="<div class='col-sm-12  col-md-4 col-lg-4 animation'>";
                    data +="<a href='/info/"+i.id+"'>";
                    data +="<div class='card info-card' >";
                    data +="<div class='row'>";
                    data +="<div class='col-6'>";
                    data +="<img class='profile-img' src='/img/profile.png'>";
                    data +="</div>";
                    data +="<div class='col-6'>";
                    data +="<b> Name: </b><br/>";
                    data +=i.name+"<br/>";
                    data +="<b> age: </b><br/>";
                    data +=i.age+"<br/>";
                    data +="<b> Hire Date: </b><br/>";
                    data +=formatDate(i.hire_date)+"<br/>";
                    data +="</div>";
                    data +="</div>";
                    data +="</div>";
                    data +="</a>";
                    data +="</div>";
                });
                dataDiv.html(data);
                page=page+1;

            }
            if(res.pages > 0 ){
                paginationDiv.html(loadmore);
                $('#loadMore').on('click',function(){
                    if(parseInt(res.pages) > 1 && page < (parseInt(res.pages)+1)){
                        $.ajax({
                            url:'/api/all/'+start,
                            method:"get",
                            success:function(res){
                                var data='';
                                res.rows.forEach(function(i){
                                    data +="<div class='col-sm-12  col-md-4 col-lg-4 animation'>";
                                    data +="<a href='/info/"+i.id+"'>";
                                    data +="<div class='card info-card' >";
                                    data +="<div class='row'>";
                                    data +="<div class='col-6'>";
                                    data +="<img class='profile-img' src='/img/profile.png'>";
                                    data +="</div>";
                                    data +="<div class='col-6'>";
                                    data +="<b> Name: </b><br/>";
                                    data +=i.name+"<br/>";
                                    data +="<b> age: </b><br/>";
                                    data +=i.age+"<br/>";
                                    data +="<b> Hire Date: </b><br/>";
                                    data +=formatDate(i.hire_date)+"<br/>";
                                    data +="</div>";
                                    data +="</div>";
                                    data +="</div>";
                                    data +="</a>";
                                    data +="</div>";
                                });
                                dataDiv.append(data);
                                start=start + 10;
                                page=page+1;
                            },
                            error:function(err){
                                console.log(err);
                            }
                });

            }else{
                    paginationDiv.html('No More data to be loaded');
            }
 
        });


    }

        },
    error:function(err){
        console.log(err);
    }
});

function newRecordFormValidation(){
    var numRegx=/^[0-9]+$/
    var dateRegx=/^(2[0-9]{3})-(0?[1-9]|1[0-2])[-](0?[1-9]|[12][0-9]|3[01])$/
    var textRegx=/^[a-zA-Z\s]*$/
    var name=$('#name').val();
    var age=$('#age').val();
    var salary=$('#salary').val();
    var date=$('#date').val();

    if(textRegx.test(name) && dateRegx.test(date) && numRegx.test(age) && numRegx.test(salary)){
        return true
    }else{
      return false

    }
    //console.log(name.match(textRegx),age.match(numRegx),salary.match(numbRegx),date.match(dateRegx));
}
$("#myform").submit(function(e){
   var form= $('#myform').serialize();
   var checkForm=newRecordFormValidation();
   if(checkForm){
    $.ajax({
        url:'/api/info/add',
        method:"post",
        data:form,
        success:function(res){
           // bootbox.alert(res.msg);
            setTimeout(function(){
                window.location.reload(true);
            },2000);
        },
        error:function(err){
            console.log(err);
        }
    })
    
   }else{
    bootbox.alert('make sure all fields have correct data ');
   }
  
    return false;
});

clickableB=$('.clickableB');
clickableB.on('click',function(e){
    e.preventDefault();
    var id=this.getAttribute('data-id');
    var action=this.getAttribute('data-action');
   if(action == 'delete'){
       showBox("confirm Delete Action",function(result){
        if(result){
                $.ajax({
                    url:'/api/info/'+id,
                    method:"delete",
                    success:function(res){
                       // bootbox.alert(res.msg +" <br/>you will be redirected to home page in 3 seconds");
                        setTimeout(function(){
                            window.location.href='/page';
                        },3000);
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
   }else if(action == 'update'){
    showBox('confirm Update Action',function(result){
        if(result){
            $('#deleteB').hide();
            $('#updateB').hide();
            $('#saveB').show();
            $('#cancelB').show();
            $('.field').prop("disabled", false);
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
    }else if(action == 'save'){
    showBox('confirm Save Action',function(result){
        if(result){
            var checkForm=newRecordFormValidation();
            if(checkForm){
              var form=$('#myform').serialize();
              $.ajax({
                  url:'/api/info/'+id,
                  method:"put",
                  data:form,
                  success:function(res){
                    //  bootbox.alert(res.msg);
                      setTimeout(function(){
                          window.location.reload(true);
                      },2000);
                  },
                  error:function(err){
                      console.log(err);
                  }
              })
            }else{
             bootbox.alert('make sure all fields have correct data ');
            }
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
   }else if(action == 'cancel'){
        $('#deleteB').show();
        $('#updateB').show();
        $('#saveB').hide();
        $('#cancelB').hide();
        $('.field').prop("disabled", true);
   }else if(action == 'clear'){
    $(this).closest('form').find("input[type=text]").val("");
   }

});

function showBox(msgArg,callbackArg){
    bootbox.confirm({
        message: msgArg,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-danger'
            },
            cancel: {
                label: 'No',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            callbackArg(result);
        }
    });
}
});

function formatDate(dateArg){
var date=new Date(dateArg);
var year=date.getFullYear();
var month=date.getMonth()+1;
var day=date.getDate();

return month +"/"+day + "/"+year;
}
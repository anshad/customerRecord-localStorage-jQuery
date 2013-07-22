// jQuery document ready
$(document).ready(function(){

    // Check Browser HTML5 LocalStorage Support
    if (typeof(localStorage) == 'undefined' ) {
        alert("Your browser does not support HTML5 localStorage. Try new firefox browser.");
    } else {

        // load records table on load
        getRecords(); 

        // Add New customer
        $("#addnew").click(function(){
            // show bootstrap modal
            $('#form-Modal').modal('show');
            // focus the input field
            $("#fname").focus();

        });

        

        // submit form
        $("#customer-form").submit(function(e){
            e.preventDefault(); // prevent default page refresh and submit
            var customer_id = $("#customer_id").val();
            if(customer_id != ""){
                itemId = customer_id;
            } else {
                var newDate = new Date();
                var itemId  = newDate.getTime(); 
            }
            
            // get form field values
            var first_name = $("#fname").val();
            var last_name  = $("#lname").val();
            var phone      = $("#phone").val();
            var email      = $("#email").val();
            
            // push form field values to array
            var values = new Array();
            values.push(first_name);
            values.push(last_name);
            values.push(phone);
            values.push(email);

            // if all fields are filled
            if (first_name != "" && last_name != "" && phone != "" && email != "" && validateEmail(email)) {
                try {
                    localStorage.setItem(itemId,JSON.stringify(values));
                    getRecords(); // load records table
                    $("#customer-form input").val(""); // clear fields
                    $('#form-Modal').modal('hide');
                } catch (e) {
                    if (e == QUOTA_EXCEEDED_ERR) {
                        alert('Quota exceeded!');
                    }
                    console.log(e);
                }
            } else {
                if(!validateEmail(email)) {
                   alert("Invalid E-mail ID.");
                } else {
                   alert("All fields are required.");
                }
               
            }
        }); // end form submit

        //  Clear All localStorage
        $("#clearall").click(function(){
            if(localStorage.length == 0) { // no data to clear
                $('#noDataModal').modal('show');
            } else {
                $('#warningModal').modal('show');
                // Clear all localStorage data
                $("#accept-delete").click(function(){
                    localStorage.clear(); // clear
                    getRecords(); // load records table
                    $('#warningModal').modal('hide'); // hide bootstrap Modal
                });
            }
        });
        
    } // end if support
}); // end document ready

// Retrieve records from localStorage and manipulate in DOM
function getRecords() {
    if(localStorage) { // if localstorage supported
      var content = "";
      if(localStorage.length == 0) { // nothing in localstorage
          content+="<tr><td colspan='6' style='text-align:center'>No Records Found!</td></tr>";
          $("#records tbody").html(content);
      } else{
          for (var i = 0; i < localStorage.length; i++) { // loop through keys
            var customers = JSON.parse(localStorage.getItem(localStorage.key(i)));
            var sno = i+1;
            content+="<tr><td>"+sno+"</td><td>"+customers[0]+" "+customers[1]+"</td><td>"+customers[2]+"</td><td><a href='mailto:"+customers[3]+"'>"+customers[3]+"</a></td><td><a href='#' title='Edit' onclick='editCustomer(\""+localStorage.key(i)+"\")'><i class='icon-edit'></i></a><a href='#' onclick='deleteCustomer(\""+localStorage.key(i)+"\")' title='Delete'><i class='icon-trash'></i></a></td></tr>";
            $("#records tbody").html(content);
          }
      }
    }
}

// Delete Customer
function deleteCustomer(id){
    $('#deleteModal').modal('show');
    $("#accept-remove").click(function(){
        localStorage.removeItem(id);
        getRecords(); // load records table
        $('#deleteModal').modal('hide');
    })
}

// Edit Customer 
function editCustomer(id){
    // get data array
    var customer = JSON.parse(localStorage.getItem(id));
    $("#customer_id").val(id);
    $("#fname").val(customer[0]);
    $("#lname").val(customer[1]);
    $("#phone").val(customer[2]);
    $("#email").val(customer[3]);
    // show bootstrap modal
    $('#form-Modal').modal('show'); 
}

// validate email 
function validateEmail(str) {
   var emailRegexStr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   var isvalid = emailRegexStr.test(str); 
   return isvalid;
}

// jQuery document ready
$(document).ready(function(){

    'use strict'; // enable strict mode

    var customer = {
        displayForm: function() {
            $('#form-Modal').modal('show');
        },
        addCustomer: function(event) {

            event.preventDefault(); // prevent default page refresh and submit

            // key for the storage
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
            if (first_name != "" && last_name != "" && phone != "" && email != "" && customer.validateEmail(email)) {
                try {
                    localStorage.setItem(itemId,JSON.stringify(values)); // set storage
                    customer.listCustomers(); // load records table
                    $("#customer-form input").val(""); // clear fields
                    $('#form-Modal').modal('hide');
                } catch (e) {
                    if (e == QUOTA_EXCEEDED_ERR) {
                        alert('Quota exceeded!');
                    }
                    console.log(e);
                }
            } else { // validation errors
                if(!customer.validateEmail(email)) {
                   alert("Invalid E-mail ID.");
                } else {
                   alert("All fields are required.");
                }
            }
        },
        editCustomer: function(event) {
            var id          = event.data.id;
            var customer    = JSON.parse(localStorage.getItem(id));
            $("#customer_id").val(id);
            $("#fname").val(customer[0]);
            $("#lname").val(customer[1]);
            $("#phone").val(customer[2]);
            $("#email").val(customer[3]);
            // show bootstrap modal
            $('#form-Modal').modal('show'); 
        },
        listCustomers: function() {

            if(localStorage) { // if localstorage supported

                if(localStorage.length == 0) { // nothing in localstorage

                    $('#records tbody').empty();

                    $("#records").find('tbody')
                        .append($('<tr>')
                            .append($('<td>')
                                .attr('colspan','6')
                                .css({
                                    'text-align': 'center'
                                })
                                .text('No Records Found!')
                            )
                        );

                } else{

                    $('#records tbody').empty();
                    for (var i = 0; i < localStorage.length; i++) { // loop through keys

                        var recordKey   = localStorage.key(i);
                        var customers   = JSON.parse(localStorage.getItem(recordKey));
                        var sno         = i+1;

                        $("#records").find('tbody')
                            .append($('<tr>')
                                .append($('<td>') // serial number
                                    .text(sno)
                                ).append($('<td>') // customer name
                                    .text(customers[0] + ' ' + customers[1])
                                ).append($('<td>') // customer phone
                                    .text(customers[2])
                                ).append($('<td>') // customer email
                                    .append($('<a>')
                                        .attr('href','mailto:'+customers[3]+'')
                                        .text(customers[3])
                                    )
                                ).append($('<td>') // actions
                                    .append($('<a>')
                                        .attr('href','#')
                                        .attr('title','Edit')
                                        .css('margin-right','15px')
                                        .append($('<span>')
                                            .addClass('glyphicon glyphicon-edit')
                                        )
                                        .on('click', {id:recordKey}, customer.editCustomer)
                                    ).append($('<a>')
                                        .attr('href','#')
                                        .attr('title','Delete')
                                        .append($('<span>')
                                            .addClass('glyphicon glyphicon-trash')
                                        )
                                        .on('click', {id:recordKey}, customer.deleteCustomer )
                                    )
                                )
                            );
                    }
                }
            }
        },
        deleteCustomer: function(event) {

            $('#deleteModal').modal('show');
            $("#accept-remove").click(function(){
                localStorage.removeItem(event.data.id);
                customer.listCustomers(); // load records table
                $('#deleteModal').modal('hide');
            })
        },
        clearCustomers: function() {
            if(localStorage.length == 0) { // no data to clear
                $('#noDataModal').modal('show');
            } else {
                $('#warningModal').modal('show');
                // Clear all localStorage data
                $("#accept-delete").click(function(){
                    localStorage.clear(); // clear
                    customer.listCustomers(); // load records table
                    $('#warningModal').modal('hide'); // hide bootstrap Modal
                });
            }
        },
        validateEmail: function(str) {
            var emailRegexStr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            var isvalid = emailRegexStr.test(str); 
            return isvalid;
        }
    };


    // Check Browser HTML5 LocalStorage Support
    if (typeof(localStorage) == 'undefined' ) {
        alert("Your browser does not support HTML5 localStorage. Try new firefox browser.");
    } else {

        customer.listCustomers();

        $("#addnew").on('click', customer.displayForm);

        $("#customer-form").on('submit', customer.addCustomer);

        $("#clearall").on('click', customer.clearCustomers);
        
    } // end if support
}); // end document ready





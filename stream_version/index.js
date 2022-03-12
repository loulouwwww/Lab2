var key_flag=null;
document.onkeydown =period_up;
document.onkeyup = period_reset;

var address = "E4:5F:01:42:E0:84";
var data_flag;
var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

function connection_update(){
    console.log('change connection status');
    if (document.getElementById("connection").value == "ON") {
        document.getElementById("connection").value = "OFF";
        disconnect_bt()
    } else {
        document.getElementById("connection").value = "ON"
        connect_bt()
    }
}

function connect_bt(){
    btSerial.connect(address, 1, function() {
        console.log('connected');
      });
}


function disconnect_bt(){
    if (btSerial.isOpen()){
        send_cmd('quit\r\n')
        btSerial.close();
        console.log('disconnected');
    }
}

function data_update(){
    console.log('update data');
    if (document.getElementById("update").value == "ON") {
        document.getElementById("update").value = "OFF";
        clearInterval(data_flag)
    } else {
        document.getElementById("update").value = "ON"
        data_flag=setInterval(function(){polling_data();}, 1000);
    }
}

function polling_data(){
    if (btSerial.isOpen()){
        btSerial.write(Buffer.from('polling\r\n', 'utf-8'), function(err, bytesWritten) {
            if (err) {
                console.log('Error!');
            } else {
                console.log('Send ' + bytesWritten + ' to the client!');
            }
        });
    
        btSerial.on('data', function(buffer) {
            var s_list = buffer.toString().split(",");
            // var b_status = s_list[0];
            // var t_status = s_list[1];
            document.getElementById("battery").innerHTML =  s_list[0];
            document.getElementById("temperature").innerHTML = s_list[1];
            console.log(b_status,t_status);
        });
    }
}   
    
function stream_update(){
    console.log('update stream status');
    if (document.getElementById("stream").value == "ON") {
        document.getElementById("stream").value = "OFF";
        send_cmd('stm_ed\r\n');
    } else {
        document.getElementById("stream").value = "ON"
        send_cmd('stm_st\r\n');
    }    
}
   
function send_cmd(cmd){
    if (btSerial.isOpen()){
        btSerial.write(Buffer.from(cmd, 'utf-8'), function(err, bytesWritten) {
            if (err) {
                console.log('Error!');
            } else {
                console.log('Send ' + bytesWritten + ' to the client!');
            }
        });
    }
}

function period_up(e){
    if (key_flag == null) {
        updateKey(e);
        key_flag=setInterval(function(){updateKey(e);}, 100);
    }
}

function period_reset(e){
    if (key_flag != null) {
        clearInterval(key_flag);
        key_flag=null
    }
    resetKey(e);
}


function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_cmd('87\r\n');
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_cmd('83\r\n');
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_cmd('65\r\n');
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_cmd('68\r\n');
    }
    else if (e.keyCode == '74') {
        // connection (j)
        connection_update();
    }
    else if (e.keyCode == '75') {
        // data (k)
        data_update();
    }
    else if (e.keyCode == '76') {
        // stream (l)
        stream_update();
    }

}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}

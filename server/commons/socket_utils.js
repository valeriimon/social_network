export default class Sockets {
    io
    constructor(io){
        this.io = io;
        this.main();
    }
    main(){
        NAMESPACES.onlineNsp = this.io.of('online').use((socket, next)=>{
            socket.userInfo = {};
            next();
        });
        NAMESPACES.messagesNsp = this.io.of('messaging')
        NAMESPACES.notificationNsp = this.io.of('notification');
        this.bindSockets();
    }

    bindSockets(){
        /* online functional namespace */
        NAMESPACES.onlineNsp.on('connection', (socket) => {
            socket.on('online', (user_id)=> {
                socket.userInfo.userId = user_id;
                console.log('connected', socket.userInfo);
                /**
                 * Plan of implementation on client side event 'become online': 
                 *  all users who's online will be subscribed to this event and will recieve this value.
                 *  if user has friend with such id, the online indicator will become on active state
                 */
                socket.emit('become online', socket.userInfo); 
            })
            socket.on('disconnect', () => {
                console.log('disconnected', socket.userInfo);
                socket.emit('user disconnected', socket.userInfo);
            })
        })
        /* online functional namespace  */

        /* messagings namespace */
        NAMESPACES.messagesNsp.on('connection', (socket)=> {
            socket.on('duo chatroom created', roomInfo =>{
                /**
                 * Plan of implementation on client side event 'chatroom created':
                 *  user clicked on user whith whoom hi wants to make a conversation
                 *  it will triggering the event 'chatroom created'
                 *  roomName userID who started messaging + userId reciever, example: userId1&userId2
                 *  example of roomInfo: {initiator: userId, target: userId}
                 * 
                 *   
                 */
                let roomName;
                if( roomInfo.hasOwnProperty('initiator') && roomInfo.hasOwnProperty('target')){
                    roomName = `${roomInfo['initiator']}&${roomInfo['target']}`;
                    socket.join(roomName);
                } else {
                    socket.emit('socket error', ERRORS.BAD_REQUEST);
                }
            })
            socket.on('duo chatroom leave', chatInfo => {
                /**
                 * TODO: thinking of message model 
                 * chat info has to include all messages, example: {chatID:'', }
                 * 
                 */
                const room = sockets.rooms[chatInfo.roomName];
                socket.emit('notification leaving chat', {message: 'UserId left the chat'})
            })
            socket.on('disconnect', (socket)=> {
                // TODO: send 'notification leaving chat' to all rooms where socket is

            })
            
        })
        /* messagings namespace */

        /* notification namespace */
        NAMESPACES.notificationNsp.on('connection', socket => {
            socket.on('message_send', messageInfo=>{
                const onlineUsers = this.io.of('online').clients().connected;
                for(let key in onlineUsers){
                    let user = onlineUsers[key];
                    // if(user.userInfo.hasOwnProperty('userId') && user.userInfo.userId == messageInfo.reciever){
                        user.emit('message_recieved', {to:'', from:'', text:'Hello'});
                    // }
                }
            })
            
        })
        /* notification namespace */
    }
    
    
}

export class NAMESPACES {
    static onlineNsp
    static messagesNsp
    static notificationNsp
}

export class ERRORS {
    static BAD_REQUEST = {
        status: 401,
        message: "You have done a bad request, sorry"
    }
}





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
        this.bindSockets();
    }

    bindSockets(){
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
    }
    
}

export class NAMESPACES {
    static onlineNsp
    
}





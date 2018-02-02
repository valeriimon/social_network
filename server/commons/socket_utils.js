export default class Sockets {
    io
    constructor(io){
        this.io = io;
        this.main();
    }
    main(){
        NAMESPACES.onlineNsp = this.io.of('online');
        this.bindSockets();    
    }
    bindSockets(){
        NAMESPACES.onlineNsp.on('connection', function (socket){
            console.log('online');
            socket.on('online', (user_id)=> {
                console.log(user_id);
                /**
                 * Plan of implementation on client side event 'become online': 
                 *  all users who's online will be subscribed to this event and will recieve this value.
                 *  if user has friend with such id, the online indicator will become on active state
                 */
                socket.emit('become online', user._id); 
            })
        })
    }
}

export class NAMESPACES {
    static onlineNsp

}





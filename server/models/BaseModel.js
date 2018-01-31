const BaseModel = {
    statics: {},
    methods: {}
}


BaseModel.extend = function(Schema){
    for(let key in this.statics){
        Schema.statics[key] = this.statics[key]
    }
    for(let key in this.methods){
        Schema.methods[key] = this.methods[key]
    }
    return Schema
}



module.exports = BaseModel
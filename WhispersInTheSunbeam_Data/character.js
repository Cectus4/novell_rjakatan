class Character{
    constructor(name, pos, rotation, size){
        this._name = name;
        this._pos = pos;
        this._rotation = rotation;
        this._size = size;
    }

    get name(){
        return this._name;
    }

    get pos(){
        return this._pos;
    }

    get rotation(){
        return this._rotation;
    }

    get size(){
        return this._size;
    }

    getEmoji(){
        return charEmoji.get(this.name);
    }

    set name(name){
        this._name = name;
    }

    set pos(pos){
        this._pos = pos;
    }

    set rotation(rotation){
        this._rotation = rotation;
    }

    set size(size){
        this._size = size;
    }
}
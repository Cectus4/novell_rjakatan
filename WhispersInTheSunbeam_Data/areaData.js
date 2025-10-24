class AreaData {
    constructor(text, author, characters, bg){
        this._text = text;
        this._author = author;
        this._characters = characters;
        this._bg = bg;
    }

    get text(){
        return this._text;
    }

    get author(){
        return this._author;
    }

    get characters(){
        return this._characters;
    }

    get bg(){
        return this._bg;
    }

    set text(text){
        this._text = text;
    }

    set author(author){
        this._author = author;
    }

    set characters(characters){
        this._characters = characters;
    }

    set bg(bg){
        this._bg = bg;
    }

    getAuthorColor(){
        return authorColors.get(this.author);
    }
}
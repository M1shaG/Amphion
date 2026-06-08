export namespace main {
	
	export class Song {
	    id: number;
	    author: string;
	    title: string;
	
	    static createFrom(source: any = {}) {
	        return new Song(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.author = source["author"];
	        this.title = source["title"];
	    }
	}

}


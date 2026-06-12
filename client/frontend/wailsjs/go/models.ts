export namespace main {
	
	export class Song {
	    song_id: number;
	    song_author: string;
	    song_title: string;
	
	    static createFrom(source: any = {}) {
	        return new Song(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.song_id = source["song_id"];
	        this.song_author = source["song_author"];
	        this.song_title = source["song_title"];
	    }
	}

}


interface GET_PARAM
{
	[ key: string ]: string,
}

class App
{
	private params: GET_PARAM;
	private area: HTMLElement;
	private page: string;

	constructor( id: string )
	{
		this.params = this.parseGetParam();

		const area = document.getElementById( id );
		if ( !area ) { return; }
		this.area = area;

		this.loadPage( this.page ).then( ( md ) => { this.renderPage( md ); } );
	}

	private parseGetParam(): GET_PARAM
	{
		this.page = '';
		const query = location.search.substring( 1 );
		if ( !query ) { return {}; }
		const params: GET_PARAM = {};
		query.split( '&' ).forEach( ( kv, i ) =>
		{
			const [ key, value ] = kv.split( '=', 2 );
			if ( i === 0 && value === undefined ) { this.page = key; return; }
			if ( !key ) { return; }
			params[ key ] = decodeURIComponent( value || '' );
		} );
		return params;
	}

	private loadPage( path: string ): Promise<string>
	{
		if ( !path || path.match( /\/$/ ) ) { path += 'index'; }
		return fetch( path + '.md' ).then( ( result ) =>
		{
			return result.text();
		} ).catch( ( error ) =>
		{
			return `<div class="error">
# Error

${ path } is notfound.

</div>`;
		} );
	}

	private renderPage( md: string )
	{
		const title = this.getTitle( md );
		if ( title ) { this.setTitle( title ); }
		this.area.innerHTML = marked( md );
	}

	private getTitle( md: string ): string
	{
		const m = md.match( /\# ([^\n]+)/ );
		if ( !m ) { return ''; }
		return m[ 0 ];
	}

	private setTitle( title: string )
	{
		document.title = [ title, document.title ].join( ' - ' );
	}
}

module.exports = {
	http: {
		hostname: 'localhost',
		port: 8080,
		https: false
	},
	db: {
		server: 'localhost',
		port: 1433,
		user: '',
		password: '',
	    database: '',
	 	parseJSON: true,
	    options: {
	        encrypt: false // Use true if you're on Windows Azure 
	    }
	},
	auditDb: {
		server: 'localhost',
		port: 27017,
		user: '',
		password: '',
		database: 'skills',
		collection: 'skills_audit'
	}
}
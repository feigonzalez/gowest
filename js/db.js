/*
	Database Management
	This allows the site to retrieve data from a pseudo-database. This "database" is a json
	file named "db.json", and structured as follows:
	{
		"table1":[
			{"column1":"value","column2":value},
			{"column1":"value","column2":value}
		],
		"table2":[
			{"column1":"value","column2":value},
			{"column1":"value","column2":value}
		]
	}
*/


//	selectAll() returns the whole db.json object.
async function selectAll(){
	var res;
	await fetch("/js/db.json").then(r=>r.json()).then(j=>res=j);
	return res;
}


//	selectAllFrom(table) returns the array that corresponds to the specified table from the "database".
async function selectAllFrom(table){
	var db = await selectAll();
	if(table in db){
		return db[table];
	} else {
		return null;
	}
}

/*
	selectAllWhere(table, compFunc) returns an array that corresponds to the specified table from
	the database. For each entry in the array, a developer-defined comparison function, compFunc(row),
	is called. This comparison function should return true if the row being compared should be included
	in the final returned array.
*/
async function selectAllWhere(table,compFunc){
	var res=[];
	var db = await selectAll();
	if(!(table in db)){
		return [];
	} else {
		for(var i of db[table]){
			if(compFunc(i))res.push(i)
		}
	}
	return res;
}
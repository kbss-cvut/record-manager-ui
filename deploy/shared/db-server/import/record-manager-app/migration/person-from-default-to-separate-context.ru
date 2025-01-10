PREFIX foaf: <<http://xmlns.com/foaf/0.1/>

DELETE {   
   ?a ?p ?o .
}
INSERT {
   GRAPH foaf:Person {
       ?a ?p ?o .
   }
}
WHERE {
   ?a ?p ?o .
   ?a a foaf:Person .
   
   MINUS {
     GRAPH ?g {
    	?a ?p ?o .
     }
   }
}

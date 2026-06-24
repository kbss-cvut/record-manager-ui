PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>

# Migrate dc:description / dc:source to dcterms:description / dcterms:source
# in named graphs.
DELETE {
  GRAPH ?g {
    ?s ?oldP ?o .
  }
}
INSERT {
  GRAPH ?g {
    ?s ?newP ?o .
  }
}
WHERE {
  GRAPH ?g {
    ?s ?oldP ?o .
  }
  VALUES (?oldP ?newP) {
    (dc:description dcterms:description)
    (dc:source dcterms:source)
  }
}
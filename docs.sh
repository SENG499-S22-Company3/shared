
echo "Converting GraphQL schema to Markdown..."
npx graphql-markdown graphql/schema.graphql > schema.md
echo "Converting Markdown to HTML..."
pandoc schema.md -f gfm -t html -s -o schema.html
echo "Converting Markdown to DOCX..."
pandoc schema.html -f html -t docx -s -o schema.docx

echo "Exporting Plutus scripts..."
mkdir -p compiled/json

for file in compiled/*.plutus
do
  jq . "$file" > "compiled/json/$(basename $file .plutus).json"
    echo "Exported $(basename $file .plutus).json"
do
  aiken blueprint > scripts/plutus_blueprint.json
done

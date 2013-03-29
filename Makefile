all : dex

MODULES=\
	js/dex/main.js \
	js/dex/array/array.js \
	js/dex/color/color.js \
	js/dex/console/console.js \
	js/dex/csv/csv.js \
	js/dex/datagen/datagen.js \
	js/dex/json/json.js \
	js/dex/matrix/matrix.js \
	js/dex/object/object.js

CORE=\
	js/dex/core/DexComponent.js \
	js/dex/core/Series.js

dex :
	uglifyjs $(MODULES) $(CORE) -b -o dex.js
	uglifyjs $(MODULES) $(CORE) -o dex.min.js
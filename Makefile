all : dex

dex :
	uglifyjs \
	js/dex/main.js \
	js/dex/array/array.js \
	js/dex/color/color.js \
	js/dex/csv/csv.js \
	js/dex/datagen/datagen.js \
	js/dex/matrix/matrix.js \
	js/dex/object/object.js \
	js/dex/core/DexComponent.js \
	js/dex/core/Series.js \
	-o dex.min.js
	uglifyjs \
	js/dex/main.js \
	js/dex/array/array.js \
	js/dex/color/color.js \
	js/dex/csv/csv.js \
	js/dex/datagen/datagen.js \
	js/dex/matrix/matrix.js \
	js/dex/object/object.js \
	js/dex/core/DexComponent.js \
	js/dex/core/Series.js \
	-b -o dex.js

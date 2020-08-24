export NODE_ENV="production"
export BUILD_NAME="linear-collab"

rm -rf build

echo "Building..."

yarn build

echo "Packaging..."

mkdir -p dist
zip -r dist/$BUILD_NAME-v$VER-$(date +%s).zip build

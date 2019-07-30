export default function(dataset, key) {
    let value = dataset[`share-${key}`];
    return value && typeof value == 'string' ? value.trim() : false;
}

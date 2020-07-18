// parse picture index and gallery index from URL (#&pid=1&gid=2)
export default function () {
    let hash = window.location.hash.substring(1);
    let params = {};

    if (hash.length < 5) {
        return params;
    }

    let vars = hash.split('&');
    for (let i = 0; i < vars.length; i++) {
        if (!vars[i]) {
            continue;
        }
        let pair = vars[i].split('=');
        if (pair.length < 2) {
            continue;
        }
        params[pair[0]] = pair[1];
    }

    if (params.gid) {
        params.gid = parseInt(params.gid, 10);
    }

    return params;
}

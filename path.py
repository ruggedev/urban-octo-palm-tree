# ref: stack overflow

def all_paths(edges, *, allow_same_vertices=False, allow_same_edges=False, max_length=8):
    neighbours = {None: []}
    for a, b in edges:
        for i in range(2):
            if a not in neighbours[None]:
                neighbours[None].append(a)
            if a not in neighbours:
                neighbours[a] = []
            if b not in neighbours[a]:
                neighbours[a].append(b)
            a, b = b, a
    visited_edges = {}
    visited_vertices = {}
    paths = set()
    path = []

    def rec(vertex):
        if len(path) >= 2:
            paths.add(tuple(path))
        if len(path) >= max_length:
            return
        for neighbour in neighbours.get(vertex, []):
            if not allow_same_vertices and visited_vertices.get(neighbour, 0) > 0:
                continue
            if not allow_same_edges and visited_edges.get((vertex, neighbour), 0) > 0:
                continue
            visited_vertices[neighbour] = visited_vertices.get(neighbour, 0) + 1
            visited_edges[(vertex, neighbour)] = visited_edges.get((vertex, neighbour), 0) + 1
            path.append(neighbour)
            rec(neighbour)
            path.pop()
            visited_vertices[neighbour] -= 1
            visited_edges[(vertex, neighbour)] -= 1

    rec(None)
    return sorted(paths, key=lambda e: (len(e), e))


def main():
    import json
    INPUT_PATH = 'src/constants/pairs.json'
    OUTPUT_PATH = 'src/constants/routes.json'
    STABLE_GROUP = ['USDT', 'USDC', 'DAI', 'BUSD', 'WMATIC']
    MAX_LENGTH=8
    pairs_arr = json.load(open(INPUT_PATH))

    routes = all_paths(pairs_arr, max_length=6)
    

    valid_routes = [list(i) for i in routes if i[0] in STABLE_GROUP and i[-1] in STABLE_GROUP and len(i) > 2]
    print(f'Generating routes from pairs, with max hop: {MAX_LENGTH}')
    print(f'Condition: route start and end with {STABLE_GROUP}')
    print(f'# of pairs unique: {len(pairs_arr)}')
    print(f'# of route: {len(routes)}')
    print(f'# of valid route: {len(valid_routes)}')
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(valid_routes, f, ensure_ascii=False, indent=4)

    print(f'Finished. Routes stored into {OUTPUT_PATH}')
    
if __name__ == "__main__":
    main()

# -*- coding: UTF-8 -*-
import requests, json

tree_data = []

def main():
    get_json('2zzKlxMsKTPMsZacZCPRNA', 0)
    with open('tree_data.js', 'w') as json_file:
        json_file.write('var treeData = %s' % json.dumps(tree_data))

def get_json(artist_id, order):
    # get artist id (root of the tree)
    get_artist_detail = 'https://api.spotify.com/v1/artists/%s'
    r = requests.get(get_artist_detail % artist_id)
    artist = json.loads(r.text)
    tree_data.append({'name': artist['name'], 'parent': 'null', 'children': []})

    print tree_data

    # Spotify Web API
    get_albums_from_artist = 'https://api.spotify.com/v1/artists/%s/albums?album_type=album&limit=50'
    get_albums_detail = 'https://api.spotify.com/v1/albums/%s'

    r = requests.get(get_albums_from_artist % artist_id)
    albums = json.loads(r.text)

    # Extract album id
    album_ids = []
    for album in albums['items']:
        album_ids.append(album['id'])

    # depth 1: artist (a.k.a tree_date[0])
    # depth 2: album release year
    # depth 3: album name
    # depth 4: tracks in the album
    album_name_cache = []
    for album_id in album_ids:
        isAppend = False
        r = requests.get(get_albums_detail % album_id)
        album = json.loads(r.text)
        depth_4 = []
        for track in album['tracks']['items']:
            depth_4.append({'name': track['name'], 'parent': album['name']})

        # Some albums might have duplicated name (e.g. Drake's 'Nothing was the same' and 'Nothing was the same (Deluxe version)')
        # They are basically the same thing, so here we remove all unnecessary keyword and cache it to prevent duplicates
        true_album_name = album['name']
        try:
            true_album_name = true_album_name[:true_album_name.index('(') - 1]
        except:
            pass
        if true_album_name not in album_name_cache:
            depth_3 = {'name': true_album_name, 'parent': album['release_date'][:4], 'children': depth_4}
            album_name_cache.append(true_album_name)
        else:
            continue

        # Check if there exists a particular release year branch
        # If so, append the album information to the desired release year branch
        for x in xrange(0, len(tree_data[order]['children'])):
            if tree_data[order]['children'][x]['name'] == album['release_date'][:4]:
                tree_data[order]['children'][x]['children'].append(depth_3)
                isAppend = True
                break

        # If not, create a new release year branch
        if isAppend == False:
            depth_2 = {'name': album['release_date'][:4], 'parent': tree_data[order]['name'], 'children': []}
            depth_2['children'].append(depth_3)
            tree_data[order]['children'].append(depth_2)



if __name__ == '__main__':
    main()
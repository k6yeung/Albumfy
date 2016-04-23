# -*- coding: UTF-8 -*-
import requests, json

def main():
    tree_data = []
    artist_id = '3TVXtAsR1Inumwj472S9r4'

    # get artist id (root of the tree)
    get_artist_detail = 'https://api.spotify.com/v1/artists/%s'
    r = requests.get(get_artist_detail % artist_id)
    artist = json.loads(r.text)
    tree_data.append({'name': artist['name'], 'parent': 'null', 'children': []})

    print tree_data

    # 
    get_albums_from_artist = 'https://api.spotify.com/v1/artists/%s/albums?album_type=album&limit=50'
    get_albums_detail = 'https://api.spotify.com/v1/albums/%s'

    r = requests.get(get_albums_from_artist % artist_id)
    albums = json.loads(r.text)

    # extract album id
    album_ids = []
    for album in albums['items']:
        album_ids.append(album['id'])

    for album_id in album_ids:
        isAppend = False
        r = requests.get(get_albums_detail % album_id)
        album = json.loads(r.text)
        depth_4 = []
        for track in album['tracks']['items']:
            depth_4.append({'name': track['name']})
            print album['release_date'][:4] + '---->' + album['name'] + '---->' + track['name']
        depth_3 = {'name': album['name'], 'parent': album['release_date'][:4], 'children': depth_4}
        for x in xrange(0, len(tree_data[0]['children'])):
            if tree_data[0]['children'][x]['name'] == album['release_date'][:4]:
                tree_data[0]['children'][x]['children'].append(depth_3)
                isAppend = True
                break
        if isAppend == False:
            depth_2 = {'name': album['release_date'][:4], 'parent': tree_data[0]['name'], 'children': []}
            depth_2['children'].append(depth_3)
            tree_data[0]['children'].append(depth_2)

    with open('drake.js', 'w') as json_file:
        json_file.write('var treeData = %s' % json.dumps(tree_data))

if __name__ == '__main__':
    main()
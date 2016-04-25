import requests, json

def main():
    with open('artist_list.json', 'r') as input_file:
        data = {}
        artists_list = json.loads(input_file.read())
        for artist in artists_list:
            url = 'https://api.spotify.com/v1/search'
            r = requests.get(url, params={'q': artist, 'type': 'artist'})
            json_obj = json.loads(r.text)
            data[artist] = json_obj['artists']['items'][0]['id']
            print artist + ' ' + json_obj['artists']['items'][0]['id']
    with open('artists.json', 'w') as output_file:
        output_file.write(json.dumps(data))

if __name__ == '__main__':
    main()
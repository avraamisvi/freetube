import WebTorrent from 'webtorrent';

export default class Torrent {

    constructor() {
        this.client = new WebTorrent();
    }

    seed() {

        this.client.on('torrent', function (torrent) {
            console.log('torrent: ' + torrent.infoHash);
        });

        this.client.on('error', function (err) {
            console.log('error: ' + err);
        });

        // let opts = {
        //     announce: [
        //     'udp://tracker.openbittorrent.com:80',
        //     "udp://tracker.leechers-paradise.org:6969",
        //     "udp://tracker.coppersurfer.tk:6969",
        //     "udp://tracker.opentrackr.org:1337",
        //     "udp://explodie.org:6969",
        //     "udp://zer0day.ch:1337",
        //     "wss://tracker.btorrent.xyz",
        //     "wss://tracker.openwebtorrent.com",
        //     "wss://tracker.fastcast.nz"]
        // }


        this.client.seed("./localfiles/teste1.jpg", function (torrent) {

            console.log('Client is seeding:', torrent.infoHash);
            console.log('Client is magnetURI:', torrent.magnetURI);
            console.log('Client is announce:', torrent.announce);
            console.log('Client is private:', torrent.private);
            console.log('Client is name:', torrent.name);
            console.log('Client is name:', torrent.urlList);

            console.log('<<<<<<<<<<<<<<<<<<<<<<<:', torrent.announce);

            torrent.on('upload', function (bytes) {
                console.log('uploaded: ' + bytes);
            });

            torrent.on('wire', function (wire, addr) {
                console.log('connected to peer with address ' + addr)
            });          

            torrent.on('noPeers', function (announceType) {
                console.log('announceType ' + announceType)
            });
        });


/**
 * 0
:
"udp://tracker.openbittorrent.com:80"
1
:
"udp://tracker.leechers-paradise.org:6969"
2
:
"udp://tracker.coppersurfer.tk:6969"
3
:
"udp://tracker.opentrackr.org:1337"
4
:
"udp://explodie.org:6969"
5
:
"udp://zer0day.ch:1337"
6
:
"wss://tracker.btorrent.xyz"
7
:
"wss://tracker.openwebtorrent.com"
8
:
"wss://tracker.fastcast.nz"
 */
    }

    download(hashname, torrentId) {

        this.client.on('torrent', function (torrent) {
            console.log('torrent: ' + torrent.infoHash);
        });

        this.client.on('error', function (err) {
            console.log('error: ' + err);
        });

        this.client.add(torrentId, function (torrent) {
            // Torrents can contain many files. Let's use the .mp4 file

            torrent.on('upload', function (bytes) {
                console.log('uploaded: ' + bytes);
            });

            torrent1.on('wire', function (wire, addr) {
                console.log('connected to peer with address ' + addr)
            });          

            torrent.on('noPeers', function (announceType) {
                console.log('announceType ' + announceType)
            });

            var file = torrent.files.find(function (file) {
                return file.name.includes(hashname);
            });

            //TODO download
        });

        
    }
}
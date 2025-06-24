tierlist = window.myConfig.tierlist
language = window.myConfig.language;

const content_section = document.querySelector('.hof-content-section');
if (!tierlist) {
    content_section.style.height = '100%';
    const container = document.querySelector('.hof-container');
    const img = container.querySelector('img');
    if (img) {
        img.style.height = `${content_section.offsetHeight}px`;
        img.style.objectFit = 'cover';
    }
    if (img) {
        img.style.objectPosition = 'center 9%';
    }
}

hallOfFameCategories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('hof-category');

    const title = document.createElement('h3');
    title.textContent = category.title;
    categoryDiv.appendChild(title);

    const songsDiv = document.createElement('div');
    songsDiv.classList.add('hof-songs');
    category.songs.forEach((song, index) => {
        const songP = document.createElement('p');
        const songLink = document.createElement('a');
        songLink.classList.add('custom-link');

        songLink.onclick = (event) => {
            if (song.time) {
                showAlbumOverlay(event, song.id, song.overlayName, song.time);
            } else {
                showAlbumOverlay(event, song.id, song.overlayName);
            }
        };

        songLink.innerHTML = `<u>${song.name}</u>`;
        songP.appendChild(songLink);
        songsDiv.appendChild(songP);

        if (index < category.songs.length - 1) {
            const dashP = document.createElement('p');
            dashP.textContent = '-';
            songsDiv.appendChild(dashP);
        }
    });
    categoryDiv.appendChild(songsDiv);
    content_section.appendChild(categoryDiv);
});





// DICTIONARIES
const rankColors = {
    "S": ["#FFCC00", "#FF9900"],
    "A+": ["#F0B2FF", "#D94AFF"],
    "A": ["#F0B2FF", "#D760FF"],
    "B+": ["#99FF99", "#00FF00"],
    "B": ["#99FF99", "#66FF99"],
    "C+": ["#CCECFF", "#99E6FF"],
    "C": ["#CCECFF", "#A5DEFF"],
    "D": ["#C4C4C4", "#A6A6A6"],
    "I": ["#C4C4C4", "#A6A6A6"],
};

const rankOrder = ["S", "A+", "A", "B+", "B", "C+", "C", "D", "I"];
const rankColorsOrder = rankOrder.map(rank => rankColors[rank] ? rankColors[rank][1] : '#ffffff');

const tempoText = {
    "Fast": "Fast",
    "Fmed": "Medium Fast",
    "Med": "Medium",
    "Smed": "Medium Slow",
    "Slow": "Slow"
}

// UTILITIES

function extractYtVideoId(url) {
    let liveCode;
    if (url.includes(".be")) {
        liveCode = url.substring(url.indexOf(".be") + 4);
    } else if (url.includes("live/")) {
        liveCode = url.substring(url.indexOf("live/") + 5, url.indexOf("live/") + 5 + 11);
    } else if (url.includes("v=")) {
        liveCode = url.substring(url.indexOf("v=") + 2);
    }
    if (liveCode.includes("t=")) {
        liveCode = liveCode.substring(0, liveCode.indexOf("t=") - 1);
    }
    return liveCode;
}

function extractTwVideoId(url) {
    let liveCode;
    liveCode = url.substring(url.indexOf("videos/") + 7);
    if (liveCode.includes("t=")) {
        liveCode = liveCode.substring(0, liveCode.indexOf("t=") - 1);
    }
    return liveCode;
}

function extractYtTimestamp(url) {
    let timestamp;
    if (url.includes("t=")) {
        timestamp = url.substring(url.indexOf("t=") + 2);
        if (timestamp.includes("s")) {
            timestamp = timestamp.substring(0, timestamp.indexOf("s"));
        }
    }
    else {
        timestamp = "0";
    }
    return timestamp;
}


function extractTwTimestamp(url) {
    let timer;
    timer = url.substring(url.indexOf("t=") + 2);
    if (timer.includes("s")) {
        timer = timer.substring(0, timer.indexOf("s") + 1);
    }
    const hours = parseInt(timer.substring(0, timer.indexOf("h")), 10);
    const minutes = parseInt(timer.substring(timer.indexOf("h") + 1, timer.indexOf("m")), 10);
    const seconds = parseInt(timer.substring(timer.indexOf("m") + 1, timer.indexOf("s")), 10);
    return hours * 60 * 60 + minutes * 60 + seconds;
}

function getTwTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h${minutes}m${secs}s`;
}


function applyRankColors(row, rank, songTitle = null, currentTitle = null) {
    for (let i = 0; i < row.cells.length; i++) {
        if (rankColors[rank]) {
            // If the song title matches the provided songTitle, apply special styling
            if (songTitle && currentTitle === songTitle) {
                row.style.backgroundColor = rankColors[rank][0];
                row.cells[i].style.color = 'black';
            } else {
                // Regular styling
                row.cells[i].style.color = rankColors[rank][0];
                if (i === 1) {
                    row.cells[i].style.color = rankColors[rank][1];
                }
            }
        } else {
            // Handle cases where rank includes a letter but is not an exact match
            const baseRank = rank[0];
            if (rankColors[baseRank]) {
                if (songTitle && currentTitle === songTitle) {
                    row.style.backgroundColor = rankColors[baseRank][0];
                    row.cells[i].style.color = 'black';
                } else {
                    row.cells[i].style.color = rankColors[baseRank][0];
                    if (i === 1) {
                        row.cells[i].style.color = rankColors[baseRank][1];
                    }
                }
            }
        }
    }
}


function createAlbumCircle(numSongs, colors) {
    const svgNS = "http://www.w3.org/2000/svg";
    const circleSize = 30;
    const circleRadius = circleSize / 2;
    const strokeWidth = 6.5;
    const circumference = 2 * Math.PI * circleRadius;
    const arcLength = circumference / numSongs;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", circleSize);
    svg.setAttribute("height", circleSize);
    svg.setAttribute("viewBox", `0 0 ${circleSize} ${circleSize}`);

    // Create the larger background circle (translucent black)
    const backgroundCircle = document.createElementNS(svgNS, "circle");
    backgroundCircle.setAttribute("cx", circleRadius);
    backgroundCircle.setAttribute("cy", circleRadius);
    backgroundCircle.setAttribute("r", circleRadius);
    backgroundCircle.setAttribute("fill", "rgba(0, 0, 0, 0.5)");
    svg.appendChild(backgroundCircle);

    // Create the arcs for each song, adjusting offset based on the number of songs
    for (let index = 0; index < colors.length; index++) {
        const color = colors[index];
        const arc = document.createElementNS(svgNS, "circle");
        arc.setAttribute("cx", circleRadius);
        arc.setAttribute("cy", circleRadius);
        arc.setAttribute("r", circleRadius - strokeWidth);
        arc.setAttribute("fill", "none");
        arc.setAttribute("stroke", color);
        arc.setAttribute("stroke-width", strokeWidth);
        if (index != 0) {
            arc.setAttribute("stroke-dasharray", `0 ${(arc.getAttribute("r") * index * 2 * Math.PI)/numSongs} 10000 10000`);
        }
        arc.setAttribute("transform", `rotate(-90 ${circleRadius} ${circleRadius})`);

        svg.appendChild(arc);
    }

    return svg;
}



// DATABASE
let all_albums = [];
let response;

async function getdb() {
    try {
        const dbUrl = ""

        if (language === "en") {
            response = await fetch(extractDb(dbUrl+"_EN})"));
        }
        else {
            response = await fetch(extractDb(dbUrl+"_FR})"));
        }
        if (!response.ok) {
            throw new Error('Database fetch failed, reload the page');
        }
        const data = await response.json();
        renderAlbums(data.albums);
        updateJukeboxSongs();
    } catch (error) {
        console.error('Database fetch failed, reload the page: ', error);
    }
}

// Render albums
document.addEventListener('DOMContentLoaded', getdb);

function renderAlbums(albums) {
    const albumContainer = document.getElementById('album-container');
    albums.forEach(album => {

        all_albums.push(album);
        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.id = album.id;
        albumItem.onclick = (event) => showAlbumOverlay(event, album.id);

        const albumImage = document.createElement('img');
        albumImage.className = 'album-item-image';
        albumImage.src = album.picture_link;
        albumImage.alt = album.title;

        const albumTitle = document.createElement('div');
        albumTitle.className = 'album-item-title';
        albumTitle.textContent = album.title;

        const albumDate = document.createElement('div');
        albumDate.className = 'album-item-date';
        albumDate.textContent = album.date;

        albumItem.appendChild(albumImage);
        albumItem.appendChild(albumTitle);
        albumItem.appendChild(albumDate);

        const n_songs = album.songs.length;
        let songColors = [];
        for (song of album.songs) {
            songColors.push(rankColors[song.rank][1]);
        }
        songColors.sort((a, b) => {
            const aIndex = rankColorsOrder.indexOf(a);
            const bIndex = rankColorsOrder.indexOf(b);
            return aIndex - bIndex;
        });
        if (tierlist) {
            const circle = createAlbumCircle(n_songs, songColors);
            albumItem.appendChild(circle);
        }

        // Add YouTube icon SVG
        // const youtubeIcon = createYouTubeIcon();

        if (album.id.includes('t')) {
            const imgtwitch = document.createElement('img');
            imgtwitch.src = svgPath + '/twitch.svg';
            imgtwitch.className = 'twitch-icon';
            imgtwitch.alt = 'Twitch icon';
            albumItem.appendChild(imgtwitch);
        }
        else {
            const imgyt = document.createElement('img');
            imgyt.src = svgPath + '/youtube.svg';
            imgyt.className = 'youtube-icon';
            imgyt.alt = 'YouTube icon';
            albumItem.appendChild(imgyt);
        }

        if (album.id.includes('l') || album.id === 's230328t' || album.id === 's230328tB') {
            const imglive = document.createElement('img');
            imglive.src = svgPath + '/live.svg';
            imglive.className = 'live-icon';
            imglive.alt = 'Live icon';
            albumItem.appendChild(imglive);
        }

        albumContainer.appendChild(albumItem);
    });
}

// OVERLAY
function showAlbumOverlay(event, albumId, songTitle = null, timestamp = "0h0m0s") {
    event.stopPropagation();
    const album = all_albums.find(album => album.id === albumId);
    if (album) {
        const songs = album.songs;
        const overlay = document.getElementById('album-overlay');
        const overlayContent = document.getElementById('album-overlay-content');
        overlayContent.innerHTML = ''; // Clear previous content
        const closeBtnDiv = document.createElement('div');
        closeBtnDiv.className = 'go-right';
        const closeBtn = document.createElement('img');
        closeBtn.src = svgPath + '/close.svg';
        closeBtn.id = 'close-btn';
        closeBtn.className = 'close-btn';
        closeBtn.onclick = buttonHideOverlay.bind(null, 'album');
        closeBtnDiv.appendChild(closeBtn);
        overlayContent.appendChild(closeBtnDiv);

        const firstSongUrl = songs[0].url;

        // Create player
        if (albumId.includes('t')) {
            const twitchEmbedDiv = document.createElement('div');
            twitchEmbedDiv.id = 'twitch-embed';
            twitchEmbedDiv.className = 'twitch-embed';
            overlayContent.appendChild(twitchEmbedDiv);

            const twitchScript = document.createElement('script');
            twitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
            twitchScript.onload = function() {
                const player = new Twitch.Player("twitch-embed", {
                    video: extractTwVideoId(firstSongUrl),
                    autoplay: false,
                    width: twitchEmbedDiv.offsetWidth,
                    height: twitchEmbedDiv.offsetWidth * 9 / 16,
                    time: timestamp
                });
                window.twitchPlayer = player;
            };
            twitchScript.onerror = function () {
                console.warn("Failed to load Twitch script, trying local fallback...");
                const fallbackScript = document.createElement('script');
                fallbackScript.src = jsPath + "/twitch-embed.js";
                fallbackScript.onload = function () {
                    console.log("Local Twitch fallback loaded.");

                    const player = new Twitch.Player("twitch-embed", {
                        video: extractTwVideoId(firstSongUrl),
                        autoplay: false,
                        width: twitchEmbedDiv.offsetWidth,
                        height: twitchEmbedDiv.offsetWidth * 9 / 16,
                        time: timestamp
                    });
                    window.twitchPlayer = player;
                };

                fallbackScript.onerror = function () {
                    console.error("Local fallback script also failed. Giving up.");
                    document.getElementById("twitch-embed").innerText =
                        "Twitch video unavailable. Please use direclty the URL from the song name or try again later.";
                };
                document.body.appendChild(fallbackScript);
            };
            overlayContent.appendChild(twitchScript);
        } else {
            const videoId = extractYtVideoId(firstSongUrl);
            const iframe = document.createElement('iframe');
            iframe.className = 'youtube-iframe';
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            overlayContent.appendChild(iframe);
            window.youtubePlayer = iframe;
        }
        const albumInfo = document.createElement('div');
        albumInfo.className = 'album-info';

        const albumTitle = document.createElement('div');
        albumTitle.className = 'album-title';
        albumTitle.textContent = album.title;
        albumInfo.appendChild(albumTitle);

        const albumDate = document.createElement('div');
        albumDate.className = 'album-date';
        albumDate.innerHTML = "<span class='album-date-label'>Date:</span> <span class='album-date-value'>" + album.date + "</span>";
        albumInfo.appendChild(albumDate);

        const whenRanked = document.createElement('div');
        whenRanked.className = 'album-when-ranked';
        if (tierlist) {
            whenRanked.innerHTML = "<span class='album-when-ranked-label'>" + rankedOnTxt +":</span> <span class='album-when-ranked-value'>" + album.when_ranked + "</span>";
        }
        albumInfo.appendChild(whenRanked);

        if (album.comment != "-" && tierlist) {
            const albumComment = document.createElement('div');
            albumComment.className = 'album-comment';
            albumComment.textContent = '"' + album.comment + '"';
            albumInfo.appendChild(albumComment);
        }

        overlayContent.appendChild(albumInfo);


        // Create table
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = tableHeader;
        headers.forEach(header => {
            const th = document.createElement('th');
            th.className = 'top-column';
            th.innerHTML = header;
            headerRow.appendChild(th);
            // th.style.fontVariant = 'small-caps';
        });
        table.appendChild(headerRow);

        songs.forEach(song => {
            const row = document.createElement('tr');
            Object.values(song).forEach(value => {
                if (value !== song.url && value !== song.albumId && value !== song.date && value !== song.albumTitle &&
                    (tierlist || (value !== song.rank && value !== song.comment))) {
                    const cell = document.createElement('td');
                    // If value is song name, make it clickable with the URL
                    if (value == song.name) {
                        if (song.name.length > 40) {
                            cell.className = 'title-break-column';
                        }
                        else {
                            cell.className = 'normal-column';
                        }
                        const link = document.createElement('a');
                        link.href = song.url;
                        if (tierlist) {
                            link.className = 'custom-link';
                        }
                        else {
                            link.className = 'custom-link-notierlist';
                        }
                        link.textContent = value;
                        link.target = "_blank";
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            if (albumId.includes('t')) {
                                const player = window.twitchPlayer;
                                player.seek(extractTwTimestamp(song.url));
                                player.play();
                            } else {
                                window.youtubePlayer.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&amp;start=${extractYtTimestamp(song.url)};&autoplay=1`;

                            }
                        });

                        if (songTitle && song.name === songTitle && !albumId.includes('t')) {
                            window.youtubePlayer.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&start=${extractYtTimestamp(song.url)}&autoplay=1`;
                        }


                        if (songTitle && song.name === songTitle) {
                            if (tierlist) {
                                link.style.color = "black";
                            } else {
                                link.style.fontWeight = "bold";
                                link.style.color = "#FF9900";
                            }
                        } else if (tierlist) {
                            link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                        }

                        link.addEventListener('mouseover', function() {
                            if (!(songTitle && song.name === songTitle) && tierlist) {
                                link.style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
                            }
                        });

                        link.addEventListener('mouseout', function() {
                            if (songTitle && song.name === songTitle) {
                                if (tierlist) {
                                    link.style.color = "black";
                                }
                                else {
                                    link.style.color = "#FF9900";
                                }
                            } else if (tierlist) {
                                link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                            }
                        });

                        cell.appendChild(link);
                    }
                    else {
                        cell.textContent = value;
                        if (value == song.comment) {
                            cell.className = 'break-column';
                        }
                        else if (value == song.choree) {
                            if (value.length > 40) {
                                cell.className = 'break-column';
                            }
                            else {
                                cell.className = 'choree-column';
                            }
                        }
                        else if (value == song.rank) {
                            cell.className = 'normal-column';
                            cell.textContent = value;
                            cell.style.fontWeight = 950;
                            cell.style.fontVariant = 'small-caps';
                        }
                        else if (value == song.tempo) {
                            cell.className = 'normal-column';
                            if (tempoText[value]) {
                                cell.textContent = tempoText[value];
                            }
                        }
                        else {
                            cell.className = 'normal-column';
                        }

                        if (songTitle && song.name === songTitle) {
                            if (!tierlist) {
                                cell.style.fontWeight = "bold";
                            }
                        }
                    }

                    row.appendChild(cell);
                }
            });
            if (tierlist) {
                applyRankColors(row, song.rank, songTitle, song.name);
            }
            table.appendChild(row);
        });
        overlayContent.appendChild(table);
        overlay.style.display = 'flex';
    }
}


function buttonHideOverlay(whichOverlay) {
    if (whichOverlay === 'album') {
        hideAlbumOverlay();
    }
    else if (whichOverlay === 'jukebox') {
        hideJokeboxOverlay();
    }
    else if (whichOverlay === 'database') {
        hideDatabaseOverlay();
    }
}

function hideAlbumOverlay() {
    const overlay = document.getElementById('album-overlay');
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
        iframe.src = '';
    }
    overlay.style.display = 'none';
}



// JUKEBOX
function showJukeboxOverlay() {
    updateJukeboxSongs();
    const overlay = document.getElementById('jukebox-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

function hideJokeboxOverlay() {
    const overlay = document.getElementById('jukebox-overlay');
    overlay.style.display = 'none';
}

// Arrays to hold selected options
let selectedRanks = [];
const rankDefault = document.getElementById('rankDropdownBtn').textContent;
let selectedTempos = [];
const tempoDefault = document.getElementById('tempoDropdownBtn').textContent;
let selectedDuration = "Any duration";
const durationDefault = document.getElementById('durationDropdownBtn').textContent;
let selectedPublic = "Any live";
const publicDefault = document.getElementById('publicDropdownBtn').textContent;
let selectedDate = [];
const dateDefault = document.getElementById('dateDropdownBtn').textContent;

// Array to hold songs that pass the filter
let matchingSongsList = [];

function updateSelection(input) {
    const dropdownBtn = input.closest('.dropdown').querySelector('.dropbtn');
    const checkboxes = input.closest('.dropdown-content').querySelectorAll('input[type="checkbox"]');
    const radioButtons = input.closest('.dropdown-content').querySelectorAll('input[type="radio"]');

    let selectedOptions = [];

    // Check for checkboxes
    checkboxes.forEach((cb) => {
        if (cb.checked) {
            selectedOptions.push(cb.value);
        }
    });

    // Check for radio buttons
    radioButtons.forEach((rb) => {
        if (rb.checked) {
            selectedOptions.push(rb.value);
        }
    });

    // Update button text with selected options or default message
    if (selectedOptions.length > 0) {
        dropdownBtn.textContent = selectedOptions.join(', ');
    } else {
        dropdownBtn.textContent = dropdownBtn.id.includes("rank") ? rankDefault :
                                dropdownBtn.id.includes("tempo") ? tempoDefault :
                                dropdownBtn.id.includes("duration") ? durationDefault :
                                dropdownBtn.id.includes("public") ? publicDefault : dateDefault;
    }

    // Update selected options based on dropdown
    if (dropdownBtn.id === 'rankDropdownBtn') {
        selectedRanks = updateArray(selectedRanks, input);
    } else if (dropdownBtn.id === 'tempoDropdownBtn') {
        selectedTempos = updateArray(selectedTempos, input);
    } else if (dropdownBtn.id === 'dateDropdownBtn') {
        selectedDate = updateArray(selectedDate, input);
    } else if (dropdownBtn.id === 'durationDropdownBtn') {
        selectedDuration = input.value;
    } else if (dropdownBtn.id === 'publicDropdownBtn') {
        selectedPublic = input.value;
    }

    updateJukeboxSongs();
}

// Helper function to update arrays
function updateArray(array, input) {
    const value = input.value;
    if (input.checked) {
        array.push(value);
    } else {
        array = array.filter(item => item !== value);
    }
    return array;
}

// Helper function to convert song length to minutes
function convertToMinutes(lengthStr) {
    const [minutes, seconds] = lengthStr.split("'").map(Number);
    return minutes + seconds / 60;
}

// Function to update nsongs count and store matching songs
function updateJukeboxSongs() {
    let totalSongs = 0;
    matchingSongsList = [];

    all_albums.forEach(album => {
        const matchingSongs = album.songs.filter(song => {
            const songDuration = convertToMinutes(song.length);

            const matchesRank = selectedRanks.length === 0 || selectedRanks.includes(song.rank);
            const matchesTempo = selectedTempos.length === 0 || selectedTempos.includes(song.tempo);
            const matchesDate = selectedDate.length === 0 || selectedDate.includes(album.date_short.substring(0, 4));
            const matchesDuration = selectedDuration === "Any duration" || selectedDuration === "N'importe" ||
                (selectedDuration === "<10min" && songDuration < 10) ||
                (selectedDuration === ">10min" && songDuration > 10);
            const matchesPublic = selectedPublic === "Any live" || selectedPublic === "N'importe" ||
                (selectedPublic === "Only live show" && album.id.includes('l')) ||
                (selectedPublic === "Que avec public" && album.id.includes('l')) ||
                (selectedPublic === "Only without public" && !album.id.includes('l')) ||
                (selectedPublic === "Que sans public" && !album.id.includes('l'));

            return matchesRank && matchesTempo && matchesDuration && matchesPublic && matchesDate;
        }).map(song => ({
            ...song,
            albumId: album.id,
            albumTitle: album.title,
            albumDate: album.date
        }));

        // Add the modified songs to the global list and update count
        matchingSongsList = matchingSongsList.concat(matchingSongs);
        totalSongs += matchingSongs.length;
    });

    // Update the jukebox-param-nsongs element
    const elements = document.querySelectorAll('#jukebox-nsongs');
    elements.forEach(element => {
        element.textContent = totalSongs;
    });
}


let currentSongIndex = 0;

function getNextSong() {
    if (jukeboxSongsList.length === 0) {
        return;
    }
    if (currentSongIndex === jukeboxSongsList.length - 1)
    {
        addSongToJukebox();
    }
    if (currentSongIndex === jukeboxSongsList.length - 1) {
        currentSongIndex = 0;
    }
    else {
        currentSongIndex++;
    }
    nextSong(currentSongIndex);
    document.getElementById("jukebox-next").style.display = "flex";
    document.getElementById("jukebox-prev").style.display = "flex";
    document.getElementById("jukebox-song").style.width = "100%";
}

function getPrevSong() {
    if (jukeboxSongsList.length === 0) {
        return;
    }
    if (currentSongIndex === 0 && jukeboxSongsList.length > 1) {
        currentSongIndex = jukeboxSongsList.length - 1;
    }
    else if (jukeboxSongsList.length > 1) {
        currentSongIndex--;
    }

    nextSong(currentSongIndex);
}

function addSongToJukebox() {
    if (matchingSongsList.length === 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * matchingSongsList.length);
    const randomSong = matchingSongsList[randomIndex];
    jukeboxSongsList.push(randomSong);
}

function nextSong(currentSongIndex) {
    const song = jukeboxSongsList[currentSongIndex];

    // Update song details
    document.querySelector('.jukebox-song-title').textContent = song.name;
    if (tierlist) {
        document.querySelector('.jukebox-song-title').style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
    }
    else {
        document.querySelector('.jukebox-song-title').style.color = '#FFCC00';
    }
    document.getElementById('song-length').textContent = song.length;
    document.getElementById('song-genre').textContent = song.genre;
    document.getElementById('song-tempo').textContent = song.tempo;
    document.getElementById('song-comment').textContent = song.comment;
    document.getElementById('song-choral').textContent = song.choree;
    document.getElementById('song-album').textContent = song.albumTitle;
    document.getElementById('song-album-date').textContent = song.albumDate;
    if (song.url.includes('twitch')) {
        document.getElementById('jukebox-song-album-detail').onclick = (event) => showAlbumOverlay(event, song.albumId, song.name, getTwTime(extractTwTimestamp(song.url)));
    }
    else {
        document.getElementById('jukebox-song-album-detail').onclick = (event) => showAlbumOverlay(event, song.albumId, song.name);
    }
    document.getElementById('jukebox-song-details').style.display = 'grid';
    document.getElementById('jukebox-song-album-detail').style.display = 'flex';
    const img = document.getElementById('jukebox-img');
    if (img) img.remove();
    const playbtn = document.getElementById('jukebox-play-button');
    if (playbtn) playbtn.remove();

    // Create player
    document.getElementById('jukebox-embed-container').innerHTML = '';

    const embedContainer = document.getElementById('jukebox-embed-container');
    if (song.url.includes('twitch')) {
        const twitchEmbedDiv = document.createElement('div');
        twitchEmbedDiv.id = 'jukebox-twitch-embed';
        twitchEmbedDiv.className = 'jukebox-twitch-embed';
        embedContainer.appendChild(twitchEmbedDiv);

        // const jukeboxTwitchScript = document.createElement('script');
        // jukeboxTwitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
        // jukeboxTwitchScript.onload = function() {
        //     const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
        //         video: extractTwVideoId(song.url),
        //         width: twitchEmbedDiv.offsetWidth,
        //         height: twitchEmbedDiv.offsetWidth * 9 / 16,
        //         time: getTwTime(extractTwTimestamp(song.url))
        //     });
        //     window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
        // };
        // embedContainer.appendChild(jukeboxTwitchScript);
        const jukeboxTwitchScript = document.createElement('script');
        jukeboxTwitchScript.src = "https://player.twitch.tv/js/embed/v1.js";
        jukeboxTwitchScript.onload = function() {
            const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
                video: extractTwVideoId(song.url),
                autoplay: false,
                width: twitchEmbedDiv.offsetWidth,
                height: twitchEmbedDiv.offsetWidth * 9 / 16,
                time: getTwTime(extractTwTimestamp(song.url))
            });
            window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
        };
        jukeboxTwitchScript.onerror = function () {
            console.warn("Failed to load Twitch script, trying local fallback...");
            const jukeboxFallbackScript = document.createElement('script');
            jukeboxFallbackScript.src = jsPath + "/twitch-embed.js";
            jukeboxFallbackScript.onload = function () {
                console.log("Local Twitch fallback loaded.");

                const jukeboxTwitchPlayer = new Twitch.Player("jukebox-twitch-embed", {
                    video: extractTwVideoId(song.url),
                    autoplay: false,
                    width: twitchEmbedDiv.offsetWidth,
                    height: twitchEmbedDiv.offsetWidth * 9 / 16,
                    time: getTwTime(extractTwTimestamp(song.url))
                });
                window.jukeboxTwitchPlayer = jukeboxTwitchPlayer;
            };

            jukeboxFallbackScript.onerror = function () {
                console.error("Local fallback script also failed. Giving up.");
                document.getElementById("twitch-embed").innerText =
                    "Twitch video unavailable. Please use direclty the URL from the song name or try again later.";
            };
            document.body.appendChild(jukeboxFallbackScript);
        };
        embedContainer.appendChild(jukeboxTwitchScript);
    } else {
        const videoId = extractYtVideoId(song.url);
        const iframe = document.createElement('iframe');
        iframe.className = 'jukebox-youtube-iframe';
        iframe.id = 'jukebox-youtube-embed';
        iframe.src = `https://www.youtube.com/embed/${extractYtVideoId(song.url)}?&amp;start=${extractYtTimestamp(song.url)};&autoplay=1`;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        embedContainer.appendChild(iframe);
        window.jukeboxYoutubePlayer = iframe;
    }
}



// DATABASE SEARCHER

const columnTranslater = {
    "Titre<br>(avec lien cliquable)" : "name",
    "Title<br>(with clickable link)" : "name",
    "Rank" : "rank",
    "Genre" : "genre",
    "Tempo" : "tempo",
    "Durée" : "length",
    "Length" : "length",
    "Commentaire" : "comment",
    "Comment" : "comment",
    "Chant" : "choree",
    "Choral" : "choree",
    "Date" : "date",
    "Titre de live" : "albumTitle",
    "Live title" : "albumTitle"
};


function createTableHeaders() {
    const thead = document.querySelector('#songsTable thead');
    thead.innerHTML = '';

    const headerRow = document.createElement('tr');

    databaseTableHeader.forEach(header => {
        const th = document.createElement('th');
        th.className = 'normal-column';
        th.dataset.column = columnTranslater[header];
        th.dataset.order = 'desc';

        // Set inner HTML to include the text and arrow
        th.innerHTML = `${header} <span class="arrow">&#9660;</span>`;
        th.addEventListener('click', () => sortData(header));

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
}

createTableHeaders();

function showDatabaseOverlay() {
    fill_songDatabase();
    renderTable(songDatabase);
    const overlay = document.getElementById('database-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

function hideDatabaseOverlay() {
    const overlay = document.getElementById('database-overlay');
    overlay.style.display = 'none';
    songDatabase = [];
    renderTable([]);
    document.getElementById('songsTable').style.display = 'none';
    searchCount.textContent = '';
    document.getElementById('searchBar').value = '';
}

let songDatabase = [];
let allSongs = [];

function fill_songDatabase() {
    songDatabase = [];
    allSongs = [];

    all_albums.forEach(album => {
        album.songs.forEach(song => {
            song.albumId = album.id;
            song.date = album.date_short;
            song.albumTitle = album.title;

            songDatabase.push(song);
            allSongs.push(song);
        });
    });
}

function renderTable(data = []) {
    const tbody = document.querySelector('#songsTable tbody');
    tbody.innerHTML = '';

    data.forEach(song => {
       createSongRow(song, tbody);
    });
}

// Helper function to create and append a song row
function createSongRow(song, tbody) {
    const row = document.createElement('tr');

    Object.values(song).forEach(value => {
        if (value !== song.url && value !== song.albumId &&
            (tierlist || (value !== song.rank && value !== song.comment))) {
            const cell = document.createElement('td');

            // If the value is the song name, make it clickable with a link to the URL
            if (value === song.name) {
                cell.className = song.name.length > 40 ? 'title-break-column' : 'normal-column';

                const paragraph = document.createElement('p');

                const link = document.createElement('a');
                if (tierlist) {
                    link.className = 'custom-link';
                }
                else {
                    link.className = 'custom-link-notierlist';
                }
                link.innerHTML = `<u>${song.name}</u>`;
                if (song.url.includes('twitch')) {
                    link.onclick = function(event) {
                        showAlbumOverlay(event, song.albumId, song.name, getTwTime(extractTwTimestamp(song.url)));
                    };
                }
                else {
                    link.onclick = function(event) {
                        showAlbumOverlay(event, song.albumId, song.name);
                    };
                }

                if (tierlist) {
                    link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                }

                if (tierlist) {
                    link.addEventListener('mouseover', function () {
                        link.style.color = rankColors[song.rank] ? rankColors[song.rank][1] : '#ffffff';
                    });
                    link.addEventListener('mouseout', function () {
                        link.style.color = rankColors[song.rank] ? rankColors[song.rank][0] : '#ffffff';
                    });
                }

                paragraph.appendChild(link);
                cell.appendChild(paragraph);
            } else {
                cell.textContent = value;
                if (value === song.comment || value === song.albumTitle) {
                    cell.className = 'break-column-center';
                } else if (value === song.choree || value === song.genre) {
                    cell.className = value.length > 40 ? 'break-column-center' : 'normal-column';
                } else if (value === song.rank) {
                    cell.className = 'normal-column';
                    cell.style.fontWeight = 950;
                    cell.style.fontVariant = 'small-caps';
                } else if (value === song.tempo && tempoText[value]) {
                    cell.textContent = tempoText[value];
                    cell.className = 'normal-column';
                } else {
                    cell.className = 'normal-column';
                }
            }

            row.appendChild(cell);
        }
    });

    if (tierlist) {
        applyRankColors(row, song.rank);
    }
    tbody.appendChild(row);
}


let sortOrder = {};

function sortData(column) {
    const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';
    sortOrder[column] = order;

    songDatabase.sort((a, b) => {
        let valA = a[column].toUpperCase();
        let valB = b[column].toUpperCase();

        if (column === 'rank') {
            valA = rankOrder.indexOf(valA);
            valB = rankOrder.indexOf(valB);
        }
        else if (column === 'length') {
            valA = convertToMinutes(valA);
            valB = convertToMinutes(valB);
        }

        if (valA < valB) {
            return order === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    renderTable(songDatabase);

    // Update arrow direction
    const headers = document.querySelectorAll('#songsTable th');
    headers.forEach(header => {
        const arrow = header.querySelector('.arrow');
        if (header.dataset.column === column) {
            arrow.classList.remove('asc', 'desc');
            arrow.classList.add(order);
        } else {
            arrow.classList.remove('asc', 'desc');
        }
    });
}

document.querySelectorAll('.sort').forEach(button => {
    button.addEventListener('click', () => {
        const sortBy = button.getAttribute('data-sort');
        sortData(sortBy);
    });
});

const headers = document.querySelectorAll('#songsTable th');
headers.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.column;
        sortData(column);
    });
});

const searchBar = document.getElementById('searchBar');
if (searchBar) {
    searchBar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleSearch(event.target.value);
        }
    });
} else {
    console.error('Search bar element not found');
}

function handleSearch(query) {
    query = query.toLowerCase();
    const searchCount = document.getElementById('searchCount');
    document.getElementById('songsTable').style.display = 'block';
    songDatabase = allSongs.filter(song =>
        song.name.toLowerCase().includes(query) ||
        song.rank.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query) ||
        song.tempo.toLowerCase().includes(query) ||
        song.length.toLowerCase().includes(query) ||
        song.comment.toLowerCase().includes(query) ||
        song.choree.toLowerCase().includes(query) ||
        song.date.toLowerCase().includes(query) ||
        song.albumTitle.toLowerCase().includes(query)
    );
    renderTable(songDatabase);
    if (songDatabase.length === 0) {
        searchCount.textContent = 'No songs found';
    } else if (songDatabase.length === 1) {
        searchCount.textContent = 'Found 1 song';
    } else {
        searchCount.textContent = `Found ${songDatabase.length} songs`;
    }
}
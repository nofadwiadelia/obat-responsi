/*
    IndexedDB
*/

function createDatabase(){
    //apakah browser support dengan idb 
    if(!('indexedDB' in window)){
        console.log('Web browser tidak mendukung IDB');
        return;
    }
    //membuat database
    var request = window.indexedDB.open('db-a1');

    request.onerror = tanganiError;
    request.onupgradeneeded = (e) =>{
        var db = e.target.result;
        db.onerror = tanganiError;
        var objStore = db.createObjectStore('obat', {keyPath : 'kode_obat'});
        console.log('Object obat berhasil dibuat');
    }
    request.onsuccess = (e) =>{
        db = e.target.result;
        db.onerror = tanganiError;
        console.log('Berhasil melakukan koneksi ke IDB');
        //lakukan sesuatu
        bacaDariDB();
    }
}

function tanganiError(e){
    console.log('Error IDB'+ e.target.errorCode);
}

createDatabase();
var tabel = document.getElementById('tabel-obat'),
    form = document.getElementById('form-tambah'),
    nama_obat = document.getElementById('nama_obat'),
    kode_obat = document.getElementById('kode_obat'),
    harga_obat = document.getElementById('harga_obat');

    form.addEventListener('submit', tambahBaris);

function tambahBaris(e){
    //cek apakah kode_obat sudah ada di  tabel
    if(tabel.rows.namedItem(kode_obat.value)){
        alert("Error : Kode sudah terdaftar");
        e.preventDefault();
        return;
    }

    insertKeDB({
        kode_obat : kode_obat.value,
        nama_obat : nama_obat.value,
        harga_obat : harga_obat.value,
    });

    //modifikasi tabel menggunakan fungsi apppendChild()
    var baris = tabel.insertRow(); // => <tr></tr>
    baris.id = kode_obat.value; // => <tr id="123"></tr>
    baris.insertCell().appendChild(document.createTextNode(kode_obat.value)); //=> <td>123</td>
    baris.insertCell().appendChild(document.createTextNode(nama_obat.value));
    baris.insertCell().appendChild(document.createTextNode(harga_obat.value));

    //button
    var btn = document.createElement('input'); // <input type="button" value="hapus">
    btn.type = 'button';
    btn.value = 'Hapus';
    btn.id = kode_obat.value;
    btn.className = 'btn btn-danger btn-sm';
    baris.insertCell().appendChild(btn);
    e.preventDefault();
    return;
}

function insertKeDB(obat){
    var objStore = buatTransaksi().objectStore('obat');
    var request = objStore.add(obat);
    request.onerror = tanganiError;
    request.onsuccess = console.log("obat kode" + obat.kode_obat + 'berhasil ditambahkan ke DB');
}

function buatTransaksi(){
    var transaksi = db.transaction(['obat'], 'readwrite');
    transaksi.onerror = tanganiError;
    transaksi.oncomplete = console.log("Transaksi selesai");

    return transaksi;
}

function bacaDariDB (){
    var objStore = buatTransaksi().objectStore('obat');
    objStore.openCursor().onsuccess = (e) =>{
        var result = e.target.result;
        if(result){
            console.log('Membaca [' + result.value.kode_obat+'] dari DB');

            //modifikasi tabel menggunakan fungsi apppendChild()
            var baris = tabel.insertRow(); // => <tr></tr>
            baris.id = result.value.kode_obat; // => <tr id="123"></tr>
            baris.insertCell().appendChild(document.createTextNode(result.value.kode_obat)); //=> <td>123</td>
            baris.insertCell().appendChild(document.createTextNode(result.value.nama_obat));
            baris.insertCell().appendChild(document.createTextNode(result.value.harga_obat));

            //button
            var btn = document.createElement('input'); // <input type="button" value="hapus">
            btn.type = 'button';
            btn.value = 'Hapus';
            btn.id = result.value.kode_obat;
            btn.className = 'btn btn-danger btn-sm';
            baris.insertCell().appendChild(btn);
            result.continue();
        }
    }
}

tabel.addEventListener('click', hapusBaris);
function hapusBaris(e){
    if(e.target.type === 'button'){
        var hapus = confirm('Apakah anda yakin untuk menghapus data ?');
        if(hapus){
            tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
            //kemudian hapus dari DB...
            hapusDariDB(e.target.id);
        }
    }
}

function hapusDariDB(kode_obat){
    var objStore = buatTransaksi().objectStore('obat');
    var request = objStore.delete(kode_obat);
    request.error = tanganiError;
    request.onsuccess = console.log('Berhasil menghapus obat [' +kode_obat+']');
}


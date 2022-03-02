// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract FileUpload {

    struct File {
        uint fileId;
        uint size;
        uint uploadedTime;
        string name;
        string ext;
        string description;
        string hash;
        address payable uploader;
    }
    uint public numFiles = 0;
    mapping(uint => File) public files;

    event uploadDone(
        uint fileId,
        uint size,
        uint uploadedTime,
        string name,
        string ext,
        string description,
        string hash,
        address payable uploader
        );

    function upload(uint _size, string memory _name, string memory _ext, string memory _description, string memory _hash) public{

        // file size > 0. 
        require(_size > 0);

        // name is valid
        require(bytes(_name).length > 0);

        // hash is valid
        require(bytes(_hash).length > 0);

        // file extension is valid
        require(bytes(_ext).length > 0);

        // file description is present;
        require(bytes(_description).length > 0);

        // file hash is valid;
        require(bytes(_hash).length > 0);

        require(msg.sender != address(0));
        numFiles++;
        files[numFiles] = File(numFiles, _size, block.timestamp, _name, _ext, _description, _hash, msg.sender);
        emit uploadDone(numFiles, _size, block.timestamp, _name, _ext, _description, _hash, msg.sender);
    }

}
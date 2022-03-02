const { assert } = require('chai');

const fileUpload = artifacts.require("../contracts/FileUpload.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("fileUpload", ([uploader1, uploader2]) => {
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await fileUpload.new();
  });

  describe("Contract Deployment", async() =>{
    it("Checks if the contract is deployed", async () => {
      const addr = await contractInstance.address;
      assert.notEqual(addr, 0x0);
      assert.notEqual(addr, null);
      assert.notEqual(addr, '');
      assert.notEqual(addr, undefined);
    })
  })

  describe("Initial contract state", async() => {
    it("check inital file count", async () => {
      const file_count = await contractInstance.numFiles();
      assert.equal(file_count, 0);
    })
  })

  describe("Upload file#1 from uploader1", async() => {
    let numFile, res;
    const fileSize = '2';
    const fileName = 'test';
    const fileExt = 'pdf';
    const fileDes = 'attempt1test';
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    beforeEach(async () => {
      res = await contractInstance.upload(fileSize, fileName, fileExt, fileDes, fileHash, {from: uploader1});
      numFile = await contractInstance.numFiles();
      
    });

    it("checks file upload event firing", async () => {
      assert.equal(numFile, 1, "number of files is correct");
      assert.equal(res.logs.length, 1, "event was triggered");
      assert.equal(res.logs[0].event, "uploadDone");
      assert.equal(res.logs[0].args.fileId.toNumber(), numFile.toNumber(), "fileId is a match");
      assert.equal(res.logs[0].args.size.toNumber(), fileSize, "size is a match");
      assert.equal(res.logs[0].args.name, fileName, "name is a match");
      assert.equal(res.logs[0].args.ext, fileExt, "entension matches");
      assert.equal(res.logs[0].args.description, fileDes, "description matches");
      assert.equal(res.logs[0].args.hash, fileHash, "file hash matches")  
      
      await contractInstance.upload(fileSize, fileName, fileExt, fileDes, '', { from: uploader1 }).should.be.rejected;

      await contractInstance.upload(fileSize, fileName, fileExt, '', fileHash, { from: uploader1 }).should.be.rejected;

      await contractInstance.upload(fileSize, fileName, '', fileDes, fileHash, { from: uploader1 }).should.be.rejected;


      await contractInstance.upload(fileSize, '', fileExt, fileDes, fileHash, { from: uploader1 }).should.be.rejected;

      await contractInstance.upload('', fileName , fileExt, fileDes, fileHash, { from: uploader1 }).should.be.rejected;
    })


    it("check if file struct is populated correctly", async () => {
        const fileInstance = await contractInstance.files(numFile);
        assert.equal(fileInstance.size.toNumber(), fileSize);
        assert.equal(fileInstance.name, fileName, "name is correct");
        assert.equal(fileInstance.description, fileDes, "des is correct");
        assert.equal(fileInstance.ext, fileExt, "ext is correct");
        assert.equal(fileInstance.hash, fileHash, "hash is correct");
        assert.equal(fileInstance.fileId.toNumber(), numFile, "file id is correct");
        assert.equal(fileInstance.uploader, uploader1, "right uploader");
    })
  })


  describe("Upload file#1 from uploader2", async() => {
    let numFile, res;
    const fileSize = '21';
    const fileName = 'test2';
    const fileExt = 'png';
    const fileDes = 'attempttest2';
    const fileHash = 'QmV8jh6744NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    beforeEach(async () => {
      res = await contractInstance.upload(fileSize, fileName, fileExt, fileDes, fileHash, {from: uploader2});
      numFile = await contractInstance.numFiles();
      
    });

    it("checks file upload event firing", async () => {
      assert.equal(numFile, 1, "number of files is correct");
      assert.equal(res.logs.length, 1, "event was triggered");
      assert.equal(res.logs[0].event, "uploadDone");
      assert.equal(res.logs[0].args.fileId.toNumber(), numFile.toNumber(), "fileId is a match");
      assert.equal(res.logs[0].args.size.toNumber(), fileSize, "size is a match");
      assert.equal(res.logs[0].args.name, fileName, "name is a match");
      assert.equal(res.logs[0].args.ext, fileExt, "entension matches");
      assert.equal(res.logs[0].args.description, fileDes, "description matches");
      assert.equal(res.logs[0].args.hash, fileHash, "file hash matches")  
      
      await contractInstance.upload(fileSize, fileName, fileExt, fileDes, '', { from: uploader2 }).should.be.rejected;

      await contractInstance.upload(fileSize, fileName, fileExt, '', fileHash, { from: uploader2 }).should.be.rejected;

      await contractInstance.upload(fileSize, fileName, '', fileDes, fileHash, { from: uploader1 }).should.be.rejected;


      await contractInstance.upload(fileSize, '', fileExt, fileDes, fileHash, { from: uploader2 }).should.be.rejected;

      await contractInstance.upload('', fileName , fileExt, fileDes, fileHash, { from: uploader2 }).should.be.rejected;
    })


    it("check if file struct is populated correctly", async () => {
        const fileInstance = await contractInstance.files(numFile);
        assert.equal(fileInstance.size.toNumber(), fileSize);
        assert.equal(fileInstance.name, fileName, "name is correct");
        assert.equal(fileInstance.description, fileDes, "des is correct");
        assert.equal(fileInstance.ext, fileExt, "ext is correct");
        assert.equal(fileInstance.hash, fileHash, "hash is correct");
        assert.equal(fileInstance.fileId.toNumber(), numFile, "file id is correct");
        assert.equal(fileInstance.uploader, uploader2, "right uploader");
    })
  })


})
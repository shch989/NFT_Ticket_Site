// SPDX-License-Identifier: MIT
// 이 컨트랙트는 MIT 라이선스에 따라 라이선스가 부여됩니다.

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract TicketNFT is ERC721Enumerable {
    // 티켓 구매 정보를 저장하기 위한 Purchase 구조체 정의
    struct Purchase {
        address buyer; // 구매자의 주소
        string concert; // 콘서트 이름
        string concertDate; // 콘서트 날짜
        string concertTime; // 콘서트 시간
        uint256 purchaseTime; // 구매 시간
        string[] selectedSeats; // 선택된 좌석 목록
        uint256 paymentAmount; // 총 결제 금액
    }

    // 토큰 ID에 해당하는 티켓 구매 정보를 저장하는 배열
    Purchase[] public purchases;

    // ERC721Enumerable 컨트랙트를 상속받는 TicketNFT 컨트랙트의 생성자
    constructor(
        string memory name, // 토큰의 이름
        string memory symbol // 토큰의 심볼
    ) ERC721(name, symbol) {} // ERC721Enumerable의 생성자 호출

    // 티켓을 발행하는 함수
    function mint(
        address _to, // 발행할 티켓의 수령 주소
        string memory _concert, // 콘서트 이름
        string memory _concertDate, // 콘서트 날짜
        string memory _concertTime, // 콘서트 시간
        string[] memory _selectedSeats, // 선택된 좌석 목록
        uint256 _paymentAmount // 결제 금액
    ) external returns (uint256) {
        // 토큰 ID 반환 선언
        uint256 tokenId = purchases.length; // 새로운 티켓의 토큰 ID
        _mint(_to, tokenId); // ERC721의 mint 함수를 호출하여 티켓 발행
        // 새로운 구매 정보를 생성하여 배열에 추가
        Purchase memory newPurchase = Purchase({
            buyer: _to,
            concert: _concert,
            concertDate: _concertDate,
            concertTime: _concertTime,
            purchaseTime: block.timestamp,
            selectedSeats: _selectedSeats,
            paymentAmount: _paymentAmount
        });
        purchases.push(newPurchase);
        return tokenId; // 토큰 ID 반환
    }

    function getTicketInfo(
        uint256 _tokenId
    ) external view returns (Purchase memory) {
        require(_tokenId < purchases.length, "Ticket does not exist");
        return purchases[_tokenId];
    }

    function getOwnedTicketIds(
        address _owner
    ) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // NFT 양도 함수
    function transfer(address _to, uint256 _tokenId) external {
        require(_exists(_tokenId), "Token does not exist");
        address owner = ownerOf(_tokenId);
        require(msg.sender == owner, "Not token owner");
        require(_to != address(0), "Invalid recipient address");
        _transfer(owner, _to, _tokenId);
    }
}

// SPDX-License-Identifier: MIT
// 이 컨트랙트는 MIT 라이선스에 따라 라이선스가 부여됩니다.

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketNFT is ERC721 {
    // 티켓 구매 정보를 저장하기 위한 Purchase 구조체 정의
    struct Purchase {
        address buyer; // 구매자의 주소
        string concert; // 콘서트 이름
        uint256 purchaseTime; // 구매 시간
        string[] selectedSeats; // 선택된 좌석 목록
        uint256 paymentAmount; // 결제 금액
    }

    // 티켓 구매 정보를 토큰 ID에 매핑하여 저장하는 매핑
    mapping(uint256 => Purchase) public purchases;

    // ERC721 컨트랙트를 상속받는 TicketNFT 컨트랙트의 생성자
    constructor(
        string memory name, // 토큰의 이름
        string memory symbol // 토큰의 심볼
    ) ERC721(name, symbol) {} // ERC721의 생성자 호출

    // 티켓을 발행하는 함수
    function mint(
        address _to, // 발행할 티켓의 수령 주소
        string memory _concert, // 콘서트 이름
        uint256 _tokenId, // 발행할 티켓의 토큰 ID
        string[] memory _selectedSeats, // 선택된 좌석 목록
        uint256 _paymentAmount // 결제 금액
    ) external {
        _mint(_to, _tokenId); // ERC721의 mint 함수를 호출하여 티켓 발행
        // 새로운 구매 정보를 생성하여 매핑에 저장
        Purchase memory newPurchase = Purchase({
            buyer: _to,
            concert: _concert,
            purchaseTime: block.timestamp,
            selectedSeats: _selectedSeats,
            paymentAmount: _paymentAmount
        });
        purchases[_tokenId] = newPurchase;
    }

    function getTicketInfo(
        uint256 _tokenId
    ) external view returns (Purchase memory) {
        return purchases[_tokenId];
    }
}

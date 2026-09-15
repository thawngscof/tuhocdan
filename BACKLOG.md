# Backlog — Tự Học Đàn Organ

Kế hoạch mở rộng app từ "đọc nốt" thành giáo trình organ vỡ lòng hoàn chỉnh.
Triển khai dần, mỗi mục là một lần commit độc lập.

Trang chạy tại https://thawngscof.github.io/tuhocdan/

---

## Trạng thái hiện tại

Đã có:

- Bàn phím C2–C6 (49 phím) tương tác, phát tiếng bằng Web Audio
- Khuông nhạc khóa Sol + khóa Fa, đủ 49 nốt mỗi khóa kể cả nốt thăng
- Dòng kẻ phụ vẽ đúng, viewBox tự co giãn theo nốt
- Tab mẹo đọc nhanh (nốt cột mốc, F-A-C-E, dòng/khe)
- Game phản xạ nhận diện nốt, 3 phạm vi (cơ bản / toàn bộ / nốt thăng)

Chưa có — app mới dạy **cao độ**, toàn bộ mảng **trường độ** vắng mặt:

| Khái niệm | Trạng thái |
|---|---|
| Hình nốt (tròn, trắng, đen, móc đơn) | chưa có, renderer chỉ vẽ nốt đen |
| Dấu lặng | chưa có |
| Số chỉ nhịp, vạch nhịp, ô nhịp | chưa có |
| Tiết tấu, máy gõ nhịp | chưa có |
| Hợp âm tay trái | chưa có — thiếu sót lớn nhất với organ |
| Gam, ngón bấm | chưa có |
| Bài hát tập chơi | chưa có |
| Lộ trình bài học có thứ tự | chưa có |

## Chạy kiểm thử

```
node tools/verify.js
```

Chỉ cần Node, không cài gì thêm. **Bắt buộc chạy sau mỗi thay đổi `renderScoreSVG` hoặc dữ liệu nốt** — T1–T4 đều sửa renderer.

## Nguyên tắc kỹ thuật

- Giữ **một file `index.html` tự chứa**, không build step — deploy thẳng lên GitHub Pages
- Phụ thuộc ngoài chỉ có Tailwind CDN + Inter font, không thêm thư viện nhạc
- Toàn bộ nội dung tiếng Việt, thuật ngữ nhạc lý theo cách gọi phổ thông ở VN
- Mỗi thay đổi renderer phải verify headless được (xem `T20`)

---

## Giai đoạn 1 — Nền tảng renderer

Mọi thứ về tiết tấu đều chặn ở đây. Làm trước.

### T1 · Vẽ được hình nốt theo trường độ
Renderer thêm tham số `dur`: `w` tròn, `h` trắng, `q` đen, `e` móc đơn.
- Nốt tròn: đầu rỗng, không đuôi. Nốt trắng: đầu rỗng, có đuôi. Nốt đen: đầu đặc. Móc đơn: đầu đặc + dấu móc
- Mặc định `q` để 98 lời gọi hiện tại không đổi hành vi
- **Xong khi:** render đủ 4 hình nốt ở mọi bậc, đuôi quay đúng chiều, verify headless qua

### T2 · Dấu lặng
Lặng tròn, trắng, đen, móc đơn — vẽ đúng vị trí quy ước trên khuông.
- **Phụ thuộc:** T1

### T3 · Số chỉ nhịp, vạch nhịp, ô nhịp
Tham số `timeSig` (2/4, 3/4, 4/4). Tự chia ô nhịp theo tổng trường độ, vẽ vạch nhịp, vạch kết đôi.
- Cảnh báo ra console khi ô nhịp thừa/thiếu phách
- **Phụ thuộc:** T1, T2

### T4 · Số ngón tay
Hiện số 1–5 phía trên nốt trên khuông, và tùy chọn hiện trên phím đàn.
- **Phụ thuộc:** T1

## Giai đoạn 2 — Động cơ phát nhạc

### T5 · Máy gõ nhịp
Web Audio, chỉnh 40–208 BPM, nhấn mạnh phách đầu ô nhịp, đèn nháy theo phách.

### T6 · Phát chuỗi nốt theo trường độ
Phát một dãy nốt đúng tiết tấu, sáng phím đồng bộ, có tạm dừng / tốc độ chậm / lặp từng câu.
- Lập lịch bằng `AudioContext.currentTime`, **không** dùng `setTimeout` cho thời điểm phát
- **Phụ thuộc:** T5

### T7 · Nâng chất lượng âm thanh
Hiện tại mỗi nốt là một oscillator `triangle` + `exponentialRampToValueAtTime`, gain cứng `0.3`.
Bấm hợp âm 3–4 nốt sẽ cộng biên độ gây méo tiếng.
- Thêm ADSR envelope, master gain có giới hạn, cắt nốt cũ khi bấm lại cùng phím
- **Chặn:** T8 (hợp âm) nếu không làm sẽ nghe rất tệ

## Giai đoạn 3 — Nội dung giảng dạy

### T8 · Hợp âm tay trái
C, Dm, Em, F, G, G7, Am — thế gốc và thế đảo cơ bản.
- Sáng nhiều phím cùng lúc, hiện tên hợp âm trên khuông, phát kiểu chặn và kiểu rải
- Vòng hợp âm phổ biến: C–G–Am–F, C–Am–F–G
- **Phụ thuộc:** T7

### T9 · Gam Đô trưởng & ngón bấm
Gam đi lên/xuống hai tay, số ngón, kỹ thuật luồn ngón cái.
- **Phụ thuộc:** T4, T6

### T10 · Bài hát tập chơi
4–6 bài vỡ lòng (dân ca / thiếu nhi quen thuộc, **chỉ chọn bài thuộc phạm vi công cộng**).
- Hiện khuông nhạc đầy đủ, sáng phím theo từng nốt, chỉnh tốc độ, tập từng câu
- **Phụ thuộc:** T3, T6

### T11 · Lộ trình bài học
Tab "Bài Học" gồm ~10 bài đánh số, mỗi bài có lý thuyết → thực hành → kiểm tra.
Lưu tiến độ vào `localStorage`.
- Bài 1 nhận biết bàn phím, tìm Đô qua nhóm 2/3 phím đen
- Bài 2 khuông nhạc và khóa Sol
- Bài 3 đọc nốt khóa Sol
- Bài 4 khóa Fa và tay trái
- Bài 5 trường độ
- Bài 6 nhịp 4/4 và vạch nhịp
- Bài 7 dấu lặng
- Bài 8 gam Đô trưởng và ngón bấm
- Bài 9 hợp âm tay trái
- Bài 10 ghép hai tay, bài hát đầu tiên
- **Phụ thuộc:** T1–T10

## Giai đoạn 4 — Mở rộng

### T12 · Luyện tai
Nghe nốt / quãng rồi chọn đáp án. Tận dụng lại engine game sẵn có.

### T13 · Quãng
Quãng 2 đến quãng 8, nhận biết trên khuông và trên phím.

### T14 · Dấu giáng và hóa biểu
Dữ liệu hiện chỉ có nốt thăng (`acc: "♯"`). Thêm cách ghi giáng và hóa biểu đầu khuông.
- Cần quyết định: ghi trùng âm (C♯/D♭) hiển thị thế nào

### T15 · Nốt chấm dôi và dấu nối
- **Phụ thuộc:** T1, T3

### T16 · Chơi bằng bàn phím máy tính
Gán phím máy tính vào phím đàn, thêm nhãn ARIA cho phím.

### T17 · Bàn phím đàn trên màn hình nhỏ
29 phím trắng × 44px + 32px padding = 1308px (phím đen định vị absolute nên không cộng bề ngang), hiện phải cuộn ngang trên điện thoại. Cân nhắc thu nhỏ hoặc chế độ 2 quãng tám.

## Nợ kỹ thuật

### T18 · Sửa email tác giả commit đầu
`4ebdca2` mang email `thangwskof@...` của username cũ nên GitHub không gán về profile.
Cần `git commit --amend --reset-author` + force-push.

### T19 · Cân nhắc tách file
`index.html` đang 58KB / 918 dòng và sẽ phình nhanh khi thêm bài học.
Nếu vượt ~150KB thì tách CSS/JS ra file riêng — Pages phục vụ nhiều file bình thường, vẫn không cần build step.

### T20 · Đưa script kiểm thử vào repo — ✅ XONG
`tools/verify.js`, chạy bằng `node tools/verify.js`, exit khác 0 khi có lỗi.

Đối chiếu bằng **nguồn độc lập**: suy vị trí nốt từ tên nốt qua công thức bậc quãng, không đọc `step`/`acc` trong dữ liệu — so với chính trường mà renderer dùng thì sửa sai dữ liệu sẽ làm cả hai vế cùng đổi và phép kiểm tra thành vô nghĩa. Số dòng kẻ phụ đếm trên SVG thật chứ không tính lại.

Đã kiểm chứng bằng 8 phép phá có chủ đích, bắt được cả 8: khôi phục fallback `step: 0`, đặt sai bậc nốt, xoá dấu thăng, trả lại vòng lặp dòng kẻ phụ thừa, quay về ký âm giáng, phá `scrollKeyboardTo`, bỏ viewBox co giãn, xoá một nốt khỏi dữ liệu.

## Việc chưa kiểm chứng

- **Âm thanh chưa test thật trên trình duyệt.** Extension Chrome treo lúc kiểm tra. `playTone` có gọi `audioCtx.resume()` khi bị suspend, nhưng cần xác nhận tiếng thực sự phát ra sau cú click đầu tiên.

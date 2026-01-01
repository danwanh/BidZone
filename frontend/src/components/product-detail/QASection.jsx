export const QASection = ({
  questions,
  userRole,
  showQuestionForm,
  setShowQuestionForm,
  questionText,
  setQuestionText,
  onSubmitQuestion,
  answerText,
  setAnswerText,
  showAnswerForm,
  setShowAnswerForm,
  onAnswerQuestion,
  maskName,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Hỏi đáp ({questions.length})</h2>

        {userRole === "bidder" && (
          <button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm font-semibold"
          >
            {showQuestionForm ? "Đóng" : "Đặt câu hỏi"}
          </button>
        )}
      </div>

      {userRole === "bidder" && showQuestionForm && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <label className="text-sm font-semibold mb-2 block text-indigo-700">
            Câu hỏi của bạn:
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Nhập câu hỏi về sản phẩm..."
            className="w-full p-3 border border-indigo-300 rounded-lg text-sm mb-3"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={onSubmitQuestion}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm font-semibold"
            >
              Gửi câu hỏi
            </button>
            <button
              onClick={() => {
                setShowQuestionForm(false);
                setQuestionText("");
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-semibold"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto space-y-4">
        {questions.length > 0 ? (
          questions.map((q, i) => (
            <div key={i} className="border-l-4 border-indigo-500 pl-4 py-2">
              {q.bidder_id?.is_deleted && (
                <div>
                  <p className="font-semibold text-sm text-gray-500 underline mb-1">
                    Người dùng đã bị xóa
                  </p>
                  <div className="text-gray-800 mb-2">{q.question}</div>
                </div>
              )}
              {!q.bidder_id?.is_deleted && (
                <div>
                  <div className="font-semibold text-sm text-gray-700 mb-1">
                    {maskName(q.bidder_id?.name || null)}
                  </div>
                  <div className="text-gray-800 mb-2">{q.question}</div>
                </div>
              )}

              {q.answer && (
                <div className="bg-gray-50 p-3 rounded ml-2 border-l-2 border-green-500">
                  <div className="font-semibold text-sm text-green-700 mb-1">
                    Trả lời từ người bán:
                  </div>
                  <div className="text-gray-700 text-sm">{q.answer}</div>
                </div>
              )}

              {userRole === "seller" && !q.answer && (
                <div className="mt-3 ml-2">
                  {!showAnswerForm[q._id] ? (
                    <button
                      onClick={() =>
                        setShowAnswerForm({ ...showAnswerForm, [q._id]: true })
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                      Trả lời câu hỏi
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={answerText[q._id] || ""}
                        onChange={(e) =>
                          setAnswerText({
                            ...answerText,
                            [q._id]: e.target.value,
                          })
                        }
                        placeholder="Nhập câu trả lời..."
                        className="w-full p-3 border border-gray-300 rounded text-sm"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAnswerQuestion(q._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          Gửi trả lời
                        </button>
                        <button
                          onClick={() =>
                            setShowAnswerForm({
                              ...showAnswerForm,
                              [q._id]: false,
                            })
                          }
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-2">{q.created_at}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Chưa có câu hỏi nào</p>
        )}
      </div>
    </div>
  );
};

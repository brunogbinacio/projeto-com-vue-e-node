# src/temp/result.py

from http import HTTPStatus
from flask import jsonify

class Result:
    def __init__(self, is_success, error=None, value=None, status_code=None):
        self.is_success = is_success
        self.error = error
        self.value = value
        self.status_code = status_code

    @staticmethod
    def ok(value, status_code):
        return Result(True, value=value, status_code=status_code)

    @staticmethod
    def fail(error, status_code):
        return Result(False, error=error, status_code=status_code)

    def get_value(self):
        if not self.is_success:
            raise ValueError("Cannot get the value of a failed result")
        return self.value

    def get_error(self):
        if self.is_success:
            raise ValueError("Cannot get the error of a successful result")
        return self.error

    @staticmethod
    def send_success(response, status_code, value):
        response.status_code = status_code
        return jsonify({
            'status_code': status_code,
            'status': HTTPStatus(status_code).phrase,
            'data': value
        })

    @staticmethod
    def send_error(response, status_code, error):
        response.status_code = status_code
        return jsonify({
            'status_code': status_code,
            'status': HTTPStatus(status_code).phrase,
            'error': error
        })

    @staticmethod
    async def handle_request(req, res, use_case_method):
        try:
            result = await use_case_method(req)
            if result.is_success:
                return Result.send_success(res, result.status_code, result.value)
            else:
                return Result.send_error(res, result.status_code, result.error)
        except Exception as e:
            method_name = use_case_method.__name__ if hasattr(use_case_method, '__name__') else 'anonymous function'
            print(f"Error in {method_name}:", str(e))
            return Result.send_error(res, HTTPStatus.INTERNAL_SERVER_ERROR, str(e))

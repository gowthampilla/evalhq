from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """The standard interface for any AI being tested."""
    @abstractmethod
    def get_decision(self, scenario: str) -> dict:
        pass

class BaseEvaluator(ABC):
    """The standard interface for the Evalshq Engine."""
    @abstractmethod
    def run_eval(self) -> str:
        pass
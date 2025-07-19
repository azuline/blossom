import asyncio
import inspect

from foundation.testing.factory import TestFactory


async def test_factory():
    """Test all TestFactory static methods dynamically."""
    # List all the factory methods explicitly
    methods = [
        ("organization", TestFactory.organization),
        ("brex_expenses_raw_asset", TestFactory.brex_expenses_raw_asset),
        ("brex_expenses_categorization_asset", TestFactory.brex_expenses_categorization_asset),
        ("ramp_expenses_raw_asset", TestFactory.ramp_expenses_raw_asset),
        ("ramp_expenses_categorization_asset", TestFactory.ramp_expenses_categorization_asset),
        ("expenses_asset", TestFactory.expenses_asset),
        ("expenses_brex_vendors_asset", TestFactory.expenses_brex_vendors_asset),
        ("expenses_settings_asset", TestFactory.expenses_settings_asset),
    ]

    # First, create an organization since most methods depend on it
    organization = await TestFactory.organization()

    # Test each method with minimal required parameters
    tasks = []

    for method_name, method in methods:
        if method_name == "organization":
            # Skip organization as we already created one
            continue

        # Get method signature to check required parameters
        sig = inspect.signature(method)
        params = sig.parameters

        # Build kwargs based on method requirements
        kwargs = {}

        # Most methods take an optional organization_id parameter
        if "organization_id" in params:
            kwargs["organization_id"] = organization.id

        # Handle special dependencies
        if method_name == "brex_expenses_categorization_asset":
            # This requires a raw_expense_id
            raw_asset = await TestFactory.brex_expenses_raw_asset(organization_id=organization.id)
            kwargs["raw_expense_id"] = raw_asset.id
        elif method_name == "ramp_expenses_categorization_asset":
            # This requires a raw_expense_id
            raw_asset = await TestFactory.ramp_expenses_raw_asset(organization_id=organization.id)
            kwargs["raw_expense_id"] = raw_asset.id

        # Create task to test the method
        tasks.append(method(**kwargs))

    # Run all tests concurrently
    results = await asyncio.gather(*tasks)

    # Verify we got results for all methods
    assert len(results) == len(methods) - 1  # -1 because we skipped organization

    # Verify all results are not None
    for result in results:
        assert result is not None
        assert hasattr(result, "id")  # All our models have an id field
